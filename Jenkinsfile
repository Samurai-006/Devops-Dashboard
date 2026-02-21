pipeline{
    agent any
    stages{
        stage("Installing dependencies"){
            steps{
                bat'''
                cd frontend
                npm install
                '''
            }
        }
        stage("Running and testing frontend"){
            steps{
                bat'''
                cd frontend
                npm start
                '''
            }
        }
    }
}