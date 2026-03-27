# Devops-Dashboard

## Frontend API configuration

The React frontend reads its backend URL from `REACT_APP_API_BASE_URL`.

- Local development uses [frontend/.env.development]
- Container builds can override the value through the Docker build arg in [docker-compose.yml]
- A starter example is available in [frontend/.env.example]

## Automated regression checks

The Jenkins pipeline now runs:

- backend Jest tests before container build
- frontend Jest tests in CI mode before frontend build
- post-deployment smoke tests from inside the backend container to verify the backend API and frontend homepage

## Artifact publishing

The Jenkins pipeline can also publish Docker image artifacts for the backend and frontend.

- Images are tagged as `<build-number>-<git-sha>` and `latest`.
- Publishing runs only when Jenkins provides `DOCKER_REGISTRY`, `DOCKER_NAMESPACE`, and `DOCKER_CREDENTIALS_ID`.
- The frontend artifact build uses `REACT_APP_API_BASE_URL` so different environments can publish different frontend builds when needed.
