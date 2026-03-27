# Devops-Dashboard

## Frontend API configuration

The React frontend reads its backend URL from `REACT_APP_API_BASE_URL`.

- Local development uses [frontend/.env.development]
- Container builds can override the value through the Docker build arg in [docker-compose.yml]
- A starter example is available in [frontend/.env.example]
