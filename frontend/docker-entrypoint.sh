#!/bin/sh
set -eu

API_BASE_URL="${FRONTEND_API_BASE_URL:-http://localhost:5000}"

cat > /app/build/config.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

exec serve -s build -l 3000
