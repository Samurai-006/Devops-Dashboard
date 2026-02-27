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
                timeout 30 npm start || true
                '''
            }
        }
        stage("Building and running Docker Container (FRONTEND)"){
            agent any
            steps{
                sh'''
                docker build -t devops-frontend ./frontend
                timeout 60 docker run -p 3000:3000 devops-frontend || true
                '''
            }
        }
    }
}
