pipeline{
    agent any
    stages{
        stage("Installing dependencies"){
            steps{
                sh'''
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