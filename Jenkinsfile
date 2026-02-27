pipeline{
    agent {
        //Pull the Node.js Docker image:
        docker pull node:24-alpine
    }
    stages{
        stage("Installing dependencies"){
            steps{
                bat'''
                docker run -it --rm --entrypoint sh node:24-alpine
                node -v
                npm -v
                cd backend
                npm install
                '''
            }
        }
        stage("Checking Backend"){
            steps{
                bat'''
                cd backend
                node server.js
                '''
            }
        }
    }
}
