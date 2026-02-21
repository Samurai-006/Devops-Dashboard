pipeline{
    agent any
    stages{
        stage("Installing dependencies"){
            steps{
                bat'''
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