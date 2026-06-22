# Monitoring Setup - Persona Sintetis

## Overview
Monitoring stack for the Persona Sintetis application including health checks, metrics, and alerting.

## Health Endpoints

### `/health` - Liveness Check
Returns basic health status of the Express server.

```bash
curl http://localhost:4300/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-22T10:00:00.000Z",
  "uptime": 3600.5,
  "version": "1.0.0"
}
```

### `/ready` - Readiness Check
Verifies that the Angular build is available and the server can serve requests.

```bash
curl http://localhost:4300/ready
```

**Response (Ready):**
```json
{
  "status": "ready",
  "timestamp": "2026-06-22T10:00:00.000Z"
}
```

**Response (Not Ready):**
```json
{
  "status": "not_ready",
  "reason": "build_not_found",
  "timestamp": "2026-06-22T10:00:00.000Z"
}
```

### `/metrics` - Application Metrics
Returns runtime metrics including memory usage and process info.

```bash
curl http://localhost:4300/metrics
```

**Response:**
```json
{
  "timestamp": "2026-06-22T10:00:00.000Z",
  "memory": {
    "rss": "150.25 MB",
    "heapUsed": "45.50 MB",
    "heapTotal": "80.00 MB"
  },
  "uptime": 3600.5,
  "pid": 12345
}
```

## Monitoring Scripts

### Health Check Script
Location: `scripts/health-check.sh`

```bash
#!/bin/bash
# Quick health check for CI/CD pipelines

HEALTH_URL="http://localhost:4300/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")

if [ "$RESPONSE" -eq 200 ]; then
    echo "✓ Health check passed"
    exit 0
else
    echo "✗ Health check failed (HTTP $RESPONSE)"
    exit 1
fi
```

### Monitoring with PM2 (Optional)
For production deployments, consider using PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name persona-sintetis

# Enable PM2 startup
pm2 startup
pm2 save

# View logs
pm2 logs persona-sintetis

# Monitor in real-time
pm2 monit
```

### Cloudflare Tunnel Status
Check tunnel status:

```bash
# List all tunnels
cloudflared tunnel list

# Check tunnel status
cloudflared tunnel info persona-sintetis-tunnel

# View tunnel logs
cloudflared tunnel run persona-sintetis-tunnel
```

## Alerting Recommendations

### Critical Alerts
- **Server Down**: `/health` endpoint returns non-200 for 2+ minutes
- **Build Missing**: `/ready` endpoint returns `build_not_found`
- **Memory Leak**: RSS memory > 500MB sustained for 10+ minutes
- **Tunnel Down**: Cloudflare Tunnel disconnected

### Warning Alerts
- **High Memory**: RSS memory > 300MB
- **High CPU**: CPU usage > 80% for 5+ minutes
- **Slow Response**: Health check latency > 1 second

## Log Management

### Application Logs
Express server logs to stdout/stderr. Capture with:

```bash
# Using PM2
pm2 logs persona-sintetis --lines 100

# Using systemd (Linux)
journalctl -u persona-sintetis -f

# Docker logs
docker logs persona-sintetis -f
```

### Cloudflare Tunnel Logs
Configured in `cloudflared-config.yml`:
- Log level: `info`
- Log file: `/var/log/cloudflared/tunnel.log` (Linux) or console (Windows)

## Uptime Monitoring

### External Monitoring Services
Configure external uptime monitoring for the public endpoint:
- **UptimeRobot**: https://uptimerobot.com/
- **Pingdom**: https://www.pingdom.com/
- **Better Stack**: https://betterstack.com/

Monitor: `https://app.pesonasintetis.xyz/health`
Check interval: Every 1 minute
Expected response: HTTP 200 with `status: "healthy"`

## Dashboard (Optional)
For a visual dashboard, consider:
- **Grafana** + Prometheus for metrics visualization
- **PM2 Keymetrics** for Node.js-specific monitoring
- **Cloudflare Dashboard** for tunnel analytics
