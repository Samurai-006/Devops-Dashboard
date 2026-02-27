pipeline{
    agent {
        //Pull the Node.js Docker image:
        docker { image 'node:24-alpine' }
    }
    stages{
        stage("Installing dependencies"){
            steps{
                sh'''
                node -v
                npm -v
                cd backend
                npm install --save-dev jest
                '''
            }
        }
        stage("Testing Backend"){
            options{
                timeout(time: 2, unit: 'MINUTES')
            }
            steps{
                sh'''
                cd backend
                npm test
                '''
            }
        }
        stage("Release backend"){
            steps{
                sh 'docker build -t devops-backend ./backend'
            }
        }
    }
}
