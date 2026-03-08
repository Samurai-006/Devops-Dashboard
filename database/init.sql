CREATE TABLE deployments (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20),
    duration VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);