# 🚀 Deployment Guide - Persona Sintetis

Quick reference for deploying Persona Sintetis.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build and deploy
npm run deploy

# 3. Start server (Terminal 1)
npm run serve

# 4. Start Cloudflare Tunnel (Terminal 2)
npm run tunnel
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build Angular production bundle |
| `npm run serve` | Start Express server on port 4300 |
| `npm run deploy` | Full deployment (install + build + verify) |
| `npm run tunnel` | Start Cloudflare Tunnel |
| `npm run health` | Run health check |

## Endpoints

| Endpoint | Purpose |
|----------|---------|
| `http://localhost:4300/` | Application |
| `http://localhost:4300/health` | Health check |
| `http://localhost:4300/ready` | Readiness check |
| `http://localhost:4300/metrics` | Application metrics |
| `https://app.pesonasintetis.xyz/` | Public URL |

## First-Time Setup

### Install cloudflared

**Windows:**
```bash
winget install cloudflare.cloudflared
```

**macOS:**
```bash
brew install cloudflared
```

**Linux:**
```bash
curl -fsSL https://pkg.cloudflare.com/cloudflared.gpg | sudo apt-key add -
echo "deb https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install cloudflared
```

### Create Tunnel

```bash
# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create persona-sintetis-tunnel

# Route domain
cloudflared tunnel route dns persona-sintetis-tunnel app.pesonasintetis.xyz
```

## Monitoring

- **Health:** `curl https://app.pesonasintetis.xyz/health`
- **Logs:** Check terminal output or PM2 logs
- **Metrics:** `curl http://localhost:4300/metrics`

See `shared/monitoring.md` for detailed monitoring setup.

## Troubleshooting

**Port 4300 in use?**
```bash
# Find and kill process
netstat -ano | findstr :4300  # Windows
lsof -i :4300                 # Linux/Mac
```

**Build not found?**
```bash
npm run build
```

**Tunnel not connecting?**
```bash
cloudflared tunnel list
cloudflared tunnel run persona-sintetis-tunnel
```

---

For detailed documentation, see:
- `shared/deploy-plan.md` - Complete deployment plan
- `shared/monitoring.md` - Monitoring setup
- `shared/architecture.md` - System architecture
