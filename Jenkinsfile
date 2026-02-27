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
                
                //Verify the Node.js version:
                node -v // Should print "v24.14.0".
                
                //Verify npm version:
                npm -v // Should print "11.9.0".
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
