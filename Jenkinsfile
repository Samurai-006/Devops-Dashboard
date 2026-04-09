pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['dev', 'staging', 'prod'], description: 'Target environment for deployment')
        choice(name: 'DEPLOY_MODE', choices: ['build_and_publish', 'promote_existing'], description: 'Build new artifacts or promote an existing published image tag')
        choice(name: 'DEPLOY_TARGET_PLATFORM', choices: ['compose', 'kubernetes'], description: 'Deployment target platform')
        string(name: 'PROMOTE_IMAGE_TAG', defaultValue: '', description: 'Existing published image tag to deploy when DEPLOY_MODE=promote_existing')
    }

    environment {
        DOCKER_REGISTRY = "${env.DOCKER_REGISTRY ?: ''}"
        DOCKER_NAMESPACE = "${env.DOCKER_NAMESPACE ?: ''}"
        DOCKER_CREDENTIALS_ID = "${env.DOCKER_CREDENTIALS_ID ?: ''}"
    }

    stages {

        stage('Prepare Artifact Metadata') {
            steps {
                script {
                    env.DEPLOY_TARGET = params.DEPLOY_ENV ?: 'dev'
                    env.GIT_SHA_SHORT = sh(returnStdout: true, script: 'git rev-parse --short=8 HEAD').trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA_SHORT}"
                    env.DEPLOY_MODE_SELECTED = params.DEPLOY_MODE ?: 'build_and_publish'
                    env.DEPLOY_PLATFORM = params.DEPLOY_TARGET_PLATFORM ?: 'compose'
                    env.REGISTRY_URL = env.DOCKER_REGISTRY == 'docker.io' ? 'https://index.docker.io/v1/' : "https://${env.DOCKER_REGISTRY}"
                    env.REGISTRY_REPO_PREFIX = env.DOCKER_REGISTRY == 'docker.io' ? env.DOCKER_NAMESPACE : "${env.DOCKER_REGISTRY}/${env.DOCKER_NAMESPACE}"
                    env.BACKEND_IMAGE = "${env.REGISTRY_REPO_PREFIX}/devops-dashboard-backend"
                    env.FRONTEND_IMAGE = "${env.REGISTRY_REPO_PREFIX}/devops-dashboard-frontend"
                    env.DEPLOY_IMAGE_TAG = env.DEPLOY_MODE_SELECTED == 'promote_existing' ? params.PROMOTE_IMAGE_TAG?.trim() : env.IMAGE_TAG

                    if (env.DEPLOY_MODE_SELECTED == 'promote_existing' && !env.DEPLOY_IMAGE_TAG) {
                        error('PROMOTE_IMAGE_TAG must be provided when DEPLOY_MODE=promote_existing')
                    }
                }
            }
        }

        stage('Backend Test') {
            when {
                expression { env.DEPLOY_MODE_SELECTED != 'promote_existing' }
            }
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd backend && npm ci'
                sh 'cd backend && npm test -- --runInBand'
            }
        }

        stage('Frontend Test') {
            when {
                expression { env.DEPLOY_MODE_SELECTED != 'promote_existing' }
            }
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd frontend && npm ci'
                sh 'cd frontend && CI=true npm test -- --watchAll=false --runInBand'
            }
        }

        stage('Frontend Build') {
            when {
                expression { env.DEPLOY_MODE_SELECTED != 'promote_existing' }
            }
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd frontend && npm ci'
                sh 'cd frontend && npm run build'
            }
        }

        stage('Build Containers') {
            when {
                expression { env.DEPLOY_MODE_SELECTED != 'promote_existing' }
            }
            steps {
                sh 'docker compose build'
            }
        }

        stage('Publish Artifacts') {
            when {
                expression {
                    return env.DOCKER_REGISTRY?.trim() &&
                        env.DOCKER_NAMESPACE?.trim() &&
                        env.DOCKER_CREDENTIALS_ID?.trim() &&
                        env.DEPLOY_MODE_SELECTED != 'promote_existing'
                }
            }
            steps {
                script {
                    docker.withRegistry(env.REGISTRY_URL, env.DOCKER_CREDENTIALS_ID) {
                        def backendImage = docker.build(
                            "${env.BACKEND_IMAGE}:${env.IMAGE_TAG}",
                            './backend'
                        )
                        backendImage.push()
                        backendImage.push('latest')

                        def frontendImage = docker.build(
                            "${env.FRONTEND_IMAGE}:${env.IMAGE_TAG}",
                            './frontend'
                        )
                        frontendImage.push()
                        frontendImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Stack') {
            when {
                expression { env.DEPLOY_PLATFORM == 'compose' }
            }
            steps {
                script {
                    if (env.DOCKER_REGISTRY?.trim() && env.DOCKER_NAMESPACE?.trim() && env.DOCKER_CREDENTIALS_ID?.trim()) {
                        sh """
                        BACKEND_IMAGE=${env.BACKEND_IMAGE} FRONTEND_IMAGE=${env.FRONTEND_IMAGE} IMAGE_TAG=${env.DEPLOY_IMAGE_TAG} \\
                        docker compose --project-name devops-${env.DEPLOY_TARGET} --env-file deploy/.env.${env.DEPLOY_TARGET} -f docker-compose.deploy.yml up -d
                        """
                    } else {
                        sh 'docker compose up -d'
                    }
                }
            }
        }

        stage('Deploy To Kubernetes') {
            when {
                expression {
                    return env.DEPLOY_PLATFORM == 'kubernetes' &&
                        env.DOCKER_REGISTRY?.trim() &&
                        env.DOCKER_NAMESPACE?.trim()
                }
            }
            steps {
                sh 'kubectl apply -k k8s'
                sh "kubectl set image deployment/backend backend=${env.BACKEND_IMAGE}:${env.DEPLOY_IMAGE_TAG} -n devops-dashboard"
                sh "kubectl set image deployment/frontend frontend=${env.FRONTEND_IMAGE}:${env.DEPLOY_IMAGE_TAG} -n devops-dashboard"
                sh 'kubectl rollout status deployment/backend -n devops-dashboard'
                sh 'kubectl rollout status deployment/frontend -n devops-dashboard'
            }
        }

        stage('Regression Smoke Test') {
            steps {
                script {
                    if (env.DEPLOY_PLATFORM == 'kubernetes') {
                        sh 'kubectl get all -n devops-dashboard'
                    } else if (env.DOCKER_REGISTRY?.trim() && env.DOCKER_NAMESPACE?.trim() && env.DOCKER_CREDENTIALS_ID?.trim()) {
                        sh "docker compose --project-name devops-${env.DEPLOY_TARGET} --env-file deploy/.env.${env.DEPLOY_TARGET} -f docker-compose.deploy.yml exec -T backend npm run smoke"
                    } else {
                        sh 'docker compose exec -T backend npm run smoke'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Artifact publish config: registry=${env.DOCKER_REGISTRY ?: 'not-set'}, namespace=${env.DOCKER_NAMESPACE ?: 'not-set'}"
            echo "Artifact publish endpoint: ${env.REGISTRY_URL ?: 'not-set'}"
            echo "Deploy target: ${env.DEPLOY_TARGET ?: 'not-set'}"
            echo "Deploy mode: ${env.DEPLOY_MODE_SELECTED ?: 'not-set'}"
            echo "Deploy platform: ${env.DEPLOY_PLATFORM ?: 'not-set'}"
            echo "Deploy image tag: ${env.DEPLOY_IMAGE_TAG ?: 'not-set'}"
            echo "Published image tag for this run: ${env.IMAGE_TAG ?: 'not-generated'}"
        }
    }
}
