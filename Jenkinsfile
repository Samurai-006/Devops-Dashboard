pipeline{
    agent any
    stages{
        stage("Installing dependencies"){
            steps{
                sh'''
                cd frontend
                npm install
                '''
            }
        }
        stage("Running and testing frontend"){
            steps{
                sh'''
                cd frontend
                npm start
                '''
            }
        }
    }
}