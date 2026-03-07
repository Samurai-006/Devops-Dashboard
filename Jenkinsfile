pipeline{
    agent none
    stages{
        stage("Install and Test Node container"){
                agent {
                //Pull the Node.js Docker image:
                docker { image 'node:24-alpine' }
            }
            steps{
                sh'''
                node -v
                npm -v
                cd backend
                npm install
                npm test
                '''
            }
        }
        stage("Build Docker Image (Backend)"){
            agent any
            steps{
                sh 'docker build -t devops-backend ./backend'
            }
        }
        stage("Deploy container (HOST)") {
            agent any
            steps {
                sh '''
                docker stop devops-backend 2>/dev/null || true
                docker rm devops-backend 2>/dev/null || true
                docker run -d -p 5000:5000 --name devops-backend devops-backend
                '''
            }
        }
    }
}
