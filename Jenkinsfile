pipeline {
    agent any

    stages {

        stage('Backend Test') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'cd backend && npm ci'
                sh 'cd backend && npm test'
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
                sh 'docker-compose build'
            }
        }

        stage('Deploy Stack') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
