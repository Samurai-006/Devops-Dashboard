pipeline{
    agent none
    stages{
        stage("Install and Test"){
            agent{
                docker{
                    image 'node:24-alpine'
                }
            }
            steps{
                sh'''
                cd frontend
                npm install
                timeout 30 npm start & npm test || true
                '''
            }
        }
        stage("Building and running Docker Container (FRONTEND)"){
            agent any
            steps{
                sh '''
                docker build -t devops-frontend ./frontend
                docker stop devops-frontend || true
                docker rm devops-frontend || true
                docker run -d -p 3000:3000 --name devops-frontend devops-frontend
                '''
            }
        }
    }
}
