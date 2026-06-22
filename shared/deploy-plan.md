# 🚀 Deployment Plan - Persona Sintetis

## Overview
This document outlines the complete deployment pipeline and infrastructure setup for Persona Sintetis.

**Domain:** `app.pesonasintetis.xyz`  
**Target:** `localhost:4300` (via Cloudflare Tunnel)  
**Stack:** Angular 21 + Express + Cloudflare Tunnel

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                           │
│              app.pesonasintetis.xyz                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                 Cloudflare Tunnel                           │
│         (cloudflared daemon)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ TCP
┌─────────────────────────────────────────────────────────────┐
│                 Express Server (localhost:4300)             │
│  - Serve Angular production build                           │
│  - Health endpoints: /health, /ready, /metrics              │
│  - SPA routing fallback                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Angular Production Build                       │
│         dist/persona-sintetis/browser/                      │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
persona-sintetis/
├── server.js                 # Express server
├── package.json              # Updated with deploy scripts
├── cloudflared-config.yml    # Cloudflare Tunnel config (production)
├── .cloudflared/
│   └── config.yml            # Cloudflare Tunnel config (local)
├── scripts/
│   ├── deploy.js             # Cross-platform deployment script
│   ├── deploy.sh             # Bash deployment script
│   ├── deploy.ps1            # PowerShell deployment script
│   └── health-check.sh       # Health check for CI/CD
├── shared/
│   ├── monitoring.md         # Monitoring documentation
│   └── deploy-plan.md        # This file
└── dist/
    └── persona-sintetis/
        └── browser/          # Angular build output
```

---

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Angular dependencies
- Express server (`express@^4.18.2`)

### 2. Build Angular Application

```bash
npm run build
```

Output: `dist/persona-sintetis/browser/`

### 3. Start Express Server

```bash
npm run serve
```

Server starts on `localhost:4300` with endpoints:
- `http://localhost:4300/` - Application
- `http://localhost:4300/health` - Health check
- `http://localhost:4300/ready` - Readiness check
- `http://localhost:4300/metrics` - Application metrics

### 4. Setup Cloudflare Tunnel

#### Prerequisites
- Cloudflare account
- Domain `pesonasintetis.xyz` managed by Cloudflare
- `cloudflared` installed

#### Install cloudflared

**Windows:**
```bash
winget install cloudflare.cloudflared
# or download from: https://github.com/cloudflare/cloudflared/releases
```

**Linux:**
```bash
# Debian/Ubuntu
curl -fsSL https://pkg.cloudflare.com/cloudflared.gpg | sudo apt-key add -
echo "deb https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install cloudflared

# macOS
brew install cloudflared
```

#### Create Tunnel

```bash
# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create persona-sintetis-tunnel

# Copy credentials file to .cloudflared/
# Location varies by OS:
# Windows: C:\Users\<user>\.cloudflared\<tunnel-id>.json
# Linux: /root/.cloudflared/<tunnel-id>.json
```

#### Configure Tunnel

The tunnel configuration is already in:
- `cloudflared-config.yml` - Production config
- `.cloudflared/config.yml` - Local development config

Route the tunnel to your domain:

```bash
cloudflared tunnel route dns persona-sintetis-tunnel app.pesonasintetis.xyz
```

#### Start Tunnel

```bash
npm run tunnel
# or
cloudflared tunnel run persona-sintetis-tunnel
```

---

## Deployment Pipeline

### Local Deployment

```bash
# Full deployment (build + verify)
npm run deploy

# Start server
npm run serve

# Start tunnel (separate terminal)
npm run tunnel
```

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Health check
        run: |
          npm run serve &
          sleep 5
          ./scripts/health-check.sh
```

### Production Deployment

1. **Build:**
   ```bash
   npm run deploy
   ```

2. **Start Server:**
   ```bash
   # Using PM2 (recommended for production)
   pm2 start server.js --name persona-sintetis
   pm2 save
   pm2 startup
   ```

3. **Start Tunnel:**
   ```bash
   # As systemd service (Linux)
   cloudflared service install
   ```

---

## Health Checks

### Manual Verification

```bash
# Check health
curl http://localhost:4300/health

# Check readiness
curl http://localhost:4300/ready

# Check metrics
curl http://localhost:4300/metrics

# Check public endpoint
curl https://app.pesonasintetis.xyz/health
```

### Automated Health Check

```bash
./scripts/health-check.sh
```

---

## Monitoring

See `shared/monitoring.md` for complete monitoring setup including:
- Health endpoint documentation
- Metrics endpoint
- Alerting recommendations
- Log management
- Uptime monitoring

### Key Metrics to Monitor

| Metric | Endpoint | Warning | Critical |
|--------|----------|---------|----------|
| Server Status | `/health` | - | Non-200 for 2min |
| Build Ready | `/ready` | - | `build_not_found` |
| Memory (RSS) | `/metrics` | >300MB | >500MB |
| Uptime | `/metrics` | - | Frequent restarts |

---

## Rollback Procedure

If deployment fails:

1. **Stop the server:**
   ```bash
   # If using PM2
   pm2 stop persona-sintetis
   
   # If running directly
   # Press Ctrl+C or kill the process
   ```

2. **Revert to previous build:**
   ```bash
   # If you have backup
   cp -r dist-backup dist
   
   # Or rebuild from previous commit
   git checkout <previous-commit>
   npm run deploy
   ```

3. **Restart server:**
   ```bash
   npm run serve
   ```

4. **Verify:**
   ```bash
   ./scripts/health-check.sh
   ```

---

## Troubleshooting

### Server won't start

```bash
# Check if port 4300 is in use
netstat -ano | findstr :4300  # Windows
lsof -i :4300                 # Linux/Mac

# Kill the process and restart
```

### Build fails

```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Tunnel not connecting

```bash
# Check tunnel status
cloudflared tunnel list

# Check tunnel logs
cloudflared tunnel run persona-sintetis-tunnel

# Verify credentials
ls ~/.cloudflared/*.json
```

### 404 on all routes

```bash
# Verify build exists
ls dist/persona-sintetis/browser/index.html

# Rebuild if missing
npm run build
```

---

## Security Considerations

1. **Cloudflare Tunnel:**
   - No open inbound ports required
   - All traffic encrypted via Cloudflare
   - DDoS protection enabled

2. **Express Server:**
   - Only serves static files
   - No database direct access
   - Rate limiting recommended for production

3. **Environment Variables:**
   - Store secrets in `.env` (not committed)
   - Use Cloudflare secrets for tunnel credentials

---

## Next Steps

1. ✅ Express server setup
2. ✅ Cloudflare Tunnel configuration
3. ✅ Deploy pipeline (build → deploy)
4. ✅ Health check endpoints
5. ✅ Monitoring documentation
6. ⏳ Setup PM2 for production process management
7. ⏳ Configure external uptime monitoring
8. ⏳ Setup CI/CD (GitHub Actions / GitLab CI)

---

**Last Updated:** 2026-06-22  
**Status:** Ready for deployment
