#!/bin/bash
# Health Check Script for CI/CD
# Usage: ./scripts/health-check.sh

HEALTH_URL="${HEALTH_URL:-http://localhost:4300/health}"
TIMEOUT=5

echo "Checking health at $HEALTH_URL..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$HEALTH_URL")

if [ "$RESPONSE" -eq 200 ]; then
    echo "✓ Health check passed (HTTP $RESPONSE)"
    exit 0
else
    echo "✗ Health check failed (HTTP $RESPONSE)"
    exit 1
fi
