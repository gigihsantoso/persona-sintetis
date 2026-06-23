# Deployment Guide - Character Consistency Feature

## Prerequisites

1. **Node.js** (v18+) - ✅ Installed
2. **Supabase CLI** - ✅ Installed
3. **Cloudflare Wrangler** - ❌ Needs install
4. **Git** - ✅ Installed
5. **Docker** (optional, for local Supabase) - ❌ Not running

---

## Step 1: Install Wrangler

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

---

## Step 2: Setup Supabase Database

### Option A: Use Existing Supabase Project (Recommended)

1. Login to Supabase:
```bash
supabase login
```

2. Link to your project:
```bash
supabase link --project-ref <your-project-ref>
```

3. Apply migrations:
```bash
cd C:\Users\gigih\Documents\persona-sintetis
supabase db push
```

### Option B: Local Supabase (Requires Docker)

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db reset
```

**Note:** Docker must be running for local Supabase.

---

## Step 3: Configure Cloudflare Worker

### 3.1 Install Dependencies

```bash
cd C:\Users\gigih\Documents\persona-sintetis\workers\character-consistency
npm install
```

### 3.2 Set Environment Secrets

```bash
# Login to Cloudflare
wrangler login

# Set Supabase credentials
wrangler secret put SUPABASE_URL
# Enter: https://<project-ref>.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Enter: <your-anon-key>

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter: <your-service-role-key>

wrangler secret put CLOUDFLARE_AI_API_TOKEN
# Enter: <your-CF-AI-token>
```

### 3.3 Update wrangler.toml

Edit `wrangler.toml` and uncomment production routes:

```toml
# Production routes
[[routes]]
pattern = "api.personasintetis.com/v1/*"
zone_name = "personasintetis.com"
```

---

## Step 4: Deploy Worker

### Development (Local Testing)

```bash
cd workers/character-consistency
npm run dev
```

Worker will run at: `http://localhost:8787`

Test with curl:
```bash
# Test health endpoint
curl http://localhost:8787/api/v1/health

# List characters (should be empty)
curl http://localhost:8787/api/v1/characters
```

### Production

```bash
npm run deploy
```

Verify deployment:
```bash
wrangler tail
```

---

## Step 5: Update Frontend Configuration

### Update `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.personasintetis.com/api/v1',
  cloudflareAiGateway: 'https://gateway.ai.cloudflare.com/v1/<account>/<gateway>/workers-ai',
  supabaseUrl: 'https://<project>.supabase.co',
  supabaseAnonKey: '<anon-key>'
};
```

### Update `src/environments/environment.ts` (Development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8787/api/v1',
  cloudflareAiGateway: '',
  supabaseUrl: '',
  supabaseAnonKey: ''
};
```

---

## Step 6: Build & Deploy Frontend

```bash
cd C:\Users\gigih\Documents\persona-sintetis

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Deploy to Cloudflare Pages (or your hosting)
npm run deploy
```

---

## Step 7: Test End-to-End

### 1. Upload Character

```bash
curl -X POST http://localhost:8787/api/v1/characters \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-character.jpg" \
  -F "name=Test Character" \
  -F "description=Test character for consistency" \
  -F "tags=[test,character]"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Test Character",
    "image_url": "https://...",
    "embedding_status": "completed"
  }
}
```

### 2. Generate with Character

```bash
curl -X POST http://localhost:8787/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "<character-id-from-step-1>",
    "prompt": "Test character running in a park",
    "consistency_strength": 0.8
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "generation_id": "uuid-here",
    "status": "processing",
    "estimated_time_seconds": 25
  }
}
```

### 3. Check Generation Status

```bash
curl http://localhost:8787/api/v1/generations/<generation-id>
```

---

## Step 8: Verify in UI

1. Open browser: `http://localhost:4200` (dev) or production URL
2. Navigate to `/characters`
3. Click "Create Character"
4. Upload image and fill form
5. Go to `/generate`
6. Select character from dropdown
7. Adjust consistency slider
8. Generate!

---

## Troubleshooting

### Supabase Connection Error

```bash
# Check if Supabase is running
supabase status

# Restart local Supabase
supabase stop && supabase start
```

### Worker Deployment Fails

```bash
# Check Wrangler authentication
wrangler whoami

# Re-login if needed
wrangler login

# Check secrets
wrangler secret list
```

### CORS Errors

Add CORS headers to `worker.ts`:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
};
```

### AI Model Not Found

Verify Cloudflare AI Gateway is enabled:
1. Go to Cloudflare Dashboard
2. Navigate to AI → Gateway
3. Ensure gateway is active

---

## Cost Estimate

Based on 1000 users/month:

| Service | Usage | Cost/Month |
|---------|-------|------------|
| Cloudflare Workers | 100K requests | $5 |
| Cloudflare AI (SDXL) | 5K generations | $50-100 |
| Cloudflare AI (CLIP) | 5K embeddings | $5-10 |
| Supabase (Free tier) | <500MB storage | $0 |
| **Total** | | **~$60-115/month** |

---

## Monitoring

### Worker Logs

```bash
wrangler tail --status error
```

### Supabase Logs

Dashboard → Database → Logs

### Performance Metrics

Track these metrics:
- Average generation time (target: <30s)
- Similarity score average (target: ≥80%)
- API error rate (target: <1%)
- Daily active users

---

## Rollback Plan

If deployment fails:

1. **Worker Rollback:**
```bash
wrangler rollback
```

2. **Database Rollback:**
```bash
supabase db reset --db-url <previous-version>
```

3. **Frontend Rollback:**
```bash
git revert <commit-hash>
npm run build
npm run deploy
```

---

## Next Steps After Deployment

1. **Monitor** for 24 hours
2. **Collect** user feedback
3. **Analyze** similarity scores
4. **Optimize** AI parameters if needed
5. **Plan** Phase 2 features (batch generation, collections)

---

## Support

- **Docs:** `README.md` in each directory
- **API Spec:** `ARCHITECTURE-Character-Consistency.md`
- **Test Plan:** `TEST-PLAN-Character-Consistency.md`
- **Issues:** GitHub repo issues
