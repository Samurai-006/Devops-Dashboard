# Devops-Dashboard

## Frontend API configuration

The React frontend reads its backend URL from runtime config first, then falls back to `REACT_APP_API_BASE_URL` for local development.

- Local development uses [frontend/.env.development]
- Container deployments inject `FRONTEND_API_BASE_URL` at startup through [docker-compose.yml] or [docker-compose.deploy.yml]
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
- The same frontend artifact can now be promoted across environments because API configuration is injected at container startup.

## Multi-environment deployment

The Jenkins pipeline now supports `dev`, `staging`, and `prod` deployments through the `DEPLOY_ENV` parameter.

- `dev` deploys on ports `3000`, `5000`, and `5432`
- `staging` deploys on ports `3100`, `5100`, and `5433`
- `prod` deploys on ports `3200`, `5200`, and `5434`
- environment-specific deployment settings live in [deploy/.env.dev], [deploy/.env.staging], and [deploy/.env.prod]
- published image artifacts are deployed with [docker-compose.deploy.yml]

## Artifact promotion

The Jenkins pipeline also supports promoting an existing published image tag without rebuilding it.

- use `DEPLOY_MODE=promote_existing`
- set `PROMOTE_IMAGE_TAG` to a previously published tag such as `25-ab12cd34`
- Jenkins will skip test/build/publish stages and deploy that exact tag to the selected environment
- environment-specific API endpoints are applied at runtime, so the promoted frontend image stays immutable
