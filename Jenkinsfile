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
        stage("Deploy container (HOST)"){
            agent any
            steps{
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE'){
                    timeout(time: 2, unit: 'MINUTES'){
                        sh 'docker run -p 5000:5000 devops-backend'
                    }
                }
            }
        }
    }
}
