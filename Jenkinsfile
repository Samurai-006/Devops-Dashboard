pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "${env.DOCKER_REGISTRY ?: ''}"
        DOCKER_NAMESPACE = "${env.DOCKER_NAMESPACE ?: ''}"
        DOCKER_CREDENTIALS_ID = "${env.DOCKER_CREDENTIALS_ID ?: ''}"
        REACT_APP_API_BASE_URL = "${env.REACT_APP_API_BASE_URL ?: 'http://localhost:5000'}"
    }

    stages {

        stage('Prepare Artifact Metadata') {
            steps {
                script {
                    env.GIT_SHA_SHORT = sh(returnStdout: true, script: 'git rev-parse --short=8 HEAD').trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA_SHORT}"
                    env.REGISTRY_URL = env.DOCKER_REGISTRY == 'docker.io' ? 'https://index.docker.io/v1/' : "https://${env.DOCKER_REGISTRY}"
                    env.REGISTRY_REPO_PREFIX = env.DOCKER_REGISTRY == 'docker.io' ? env.DOCKER_NAMESPACE : "${env.DOCKER_REGISTRY}/${env.DOCKER_NAMESPACE}"
                    env.BACKEND_IMAGE = "${env.REGISTRY_REPO_PREFIX}/devops-dashboard-backend"
                    env.FRONTEND_IMAGE = "${env.REGISTRY_REPO_PREFIX}/devops-dashboard-frontend"
                }
            }
        }

        stage('Backend Test') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd backend && npm ci'
                sh 'cd backend && npm test -- --runInBand'
            }
        }

        stage('Frontend Test') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd frontend && npm ci'
                sh 'cd frontend && CI=true npm test -- --watchAll=false --runInBand'
            }
        }

        stage('Frontend Build') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd frontend && npm ci'
                sh 'cd frontend && npm run build'
            }
        }

        stage('Build Containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Publish Artifacts') {
            when {
                expression {
                    return env.DOCKER_REGISTRY?.trim() &&
                        env.DOCKER_NAMESPACE?.trim() &&
                        env.DOCKER_CREDENTIALS_ID?.trim()
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
                            "--build-arg REACT_APP_API_BASE_URL=${env.REACT_APP_API_BASE_URL} ./frontend"
                        )
                        frontendImage.push()
                        frontendImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Stack') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Regression Smoke Test') {
            steps {
                sh 'docker compose exec -T backend npm run smoke'
            }
        }
    }

    post {
        always {
            echo "Artifact publish config: registry=${env.DOCKER_REGISTRY ?: 'not-set'}, namespace=${env.DOCKER_NAMESPACE ?: 'not-set'}"
            echo "Artifact publish endpoint: ${env.REGISTRY_URL ?: 'not-set'}"
            echo "Published image tag for this run: ${env.IMAGE_TAG ?: 'not-generated'}"
        }
    }
}
