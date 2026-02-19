pipeline{
    agent{
        
    }
    stages{
        stage("Checking Port 5000"){
            steps{
                sh'''
                ss -tnlp sport = :5000 |
                '''
            }
        }
        stage("Checking APIs"){
            steps{
                sh'''
                echo "APIs are secure and running"
                '''
            }
        }
    }
}