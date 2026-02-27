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
                npm install
                '''
            }
        }
        stage("Checking Backend"){
            steps{
                sh'''
                cd backend
                node server.js
                '''
            }
        }
    }
}
