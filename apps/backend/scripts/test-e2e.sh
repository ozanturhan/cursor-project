#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")/.."

# Stop and remove existing containers
docker-compose -f docker-compose.test.yml down -v

# Build and start containers
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test-api

# Clean up
docker-compose -f docker-compose.test.yml down -v 