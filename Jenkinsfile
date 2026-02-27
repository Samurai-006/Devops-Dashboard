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
            options{
                timeout(time: 2, unit: 'MINUTES')
            }
            steps{
                sh'''
                cd backend
                node server.js
                '''
            }
        }
        stage("Release backend"){
            steps{
                sh 'echo "Backend released successfully"'
            }
        }
    }
}
