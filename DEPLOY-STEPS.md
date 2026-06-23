# 🚀 Deployment Checklist - Character Consistency

## Status Saat Ini

✅ **Wrangler installed** (v4.103.0)
✅ **Config fixed** (wrangler.toml updated)
✅ **Code committed** (git push complete)
⏳ **Authentication needed** (manual step)

---

## 🔐 Step 1: Authenticate Cloudflare

### Option A: API Token (Recommended for automation)

1. **Generate API Token:**
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Template: **"Edit Cloudflare Workers"**
   - Continue to summary
   - Click "Create Token"
   - **Copy the token** (shown only once!)

2. **Set Token:**
   ```bash
   # Windows PowerShell
   $env:CLOUDFLARE_API_TOKEN="your-token-here"
   
   # Git Bash
   export CLOUDFLARE_API_TOKEN="your-token-here"
   
   # Or add to .env file
   echo "CLOUDFLARE_API_TOKEN=your-token-here" >> .env
   ```

3. **Verify:**
   ```bash
   wrangler whoami
   ```

### Option B: OAuth Login (Interactive)

```bash
wrangler login
```

This will:
1. Open browser automatically
2. Ask you to authorize
3. Redirect back with auth code
4. Complete login

**Note:** If browser doesn't open, copy the URL from terminal output and paste manually.

---

## 🔐 Step 2: Set Worker Secrets

After authentication, set these secrets:

```bash
cd C:\Users\gigih\Documents\persona-sintetis\workers\character-consistency

# Supabase Configuration
wrangler secret put SUPABASE_URL
# Enter: https://<your-project-ref>.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Enter: <your-anon-key> (from Supabase Dashboard → Settings → API)

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter: <service-role-key> (from Supabase Dashboard → Settings → API)

wrangler secret put CLOUDFLARE_AI_API_TOKEN
# Enter: <your-CF-AI-token> (from Cloudflare Dashboard → AI → Gateway)
```

---

## 🗄️ Step 3: Setup Supabase Database

### Option A: Via Dashboard (Easiest)

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project**
3. **Open SQL Editor**
4. **Copy and run each migration file:**

   - `supabase/migrations/001_create_character_consistency_tables.sql`
   - `supabase/migrations/002_setup_storage_buckets.sql`
   - `supabase/migrations/003_create_helper_functions.sql`

5. **Verify tables created:**
   - Go to Table Editor
   - Should see: `characters`, `generations`

### Option B: Via CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Apply migrations
supabase db push
```

---

## 🚀 Step 4: Deploy Worker

```bash
cd C:\Users\gigih\Documents\persona-sintetis\workers\character-consistency

# Deploy to production
npm run deploy
```

Expected output:
```
Total Upload: xx MB / xx MB
Uploaded character-consistency-api (xx seconds)
Published character-consistency-api
https://character-consistency-api.<subdomain>.workers.dev
```

**Save the Worker URL!**

---

## 🎨 Step 5: Update Frontend Config

### Edit `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  // Replace with your actual Worker URL
  apiUrl: 'https://character-consistency-api.<subdomain>.workers.dev/api/v1',
  
  // Replace with your Cloudflare AI Gateway
  cloudflareAiGateway: 'https://gateway.ai.cloudflare.com/v1/<account-id>/<gateway-id>/workers-ai',
  
  // Replace with your Supabase project
  supabaseUrl: 'https://<project-ref>.supabase.co',
  supabaseAnonKey: '<your-anon-key>'
};
```

### Get Your IDs:

1. **Worker URL:** From deploy output
2. **Account ID:** Cloudflare Dashboard → Workers & Pages → Overview
3. **Gateway ID:** Cloudflare Dashboard → AI → Gateway → Your Gateway
4. **Supabase Project Ref:** Supabase Dashboard → Settings → General

---

## 🔨 Step 6: Build Frontend

```bash
cd C:\Users\gigih\Documents\persona-sintetis

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

Build output will be in: `dist/persona-sintetis/`

---

## 🌐 Step 7: Deploy Frontend

### Option A: Cloudflare Pages (Recommended)

```bash
# Install Cloudflare Pages CLI
npm install -g wrangler

# Deploy
wrangler pages deploy dist/persona-sintetis --project-name=persona-sintetis
```

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option C: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/persona-sintetis
```

### Option D: Manual Upload

Upload `dist/persona-sintetis/` contents to your hosting provider.

---

## 🧪 Step 8: Test End-to-End

### Test 1: Health Check

```bash
curl https://character-consistency-api.<subdomain>.workers.dev/api/v1/health
```

Expected: `{"success": true, "status": "ok"}`

### Test 2: Upload Character

```bash
curl -X POST https://character-consistency-api.<subdomain>.workers.dev/api/v1/characters \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-character.jpg" \
  -F "name=Test Character" \
  -F "description=Test character for consistency" \
  -F "tags=[\"test\",\"character\"]"
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

### Test 3: Generate with Character

```bash
curl -X POST https://character-consistency-api.<subdomain>.workers.dev/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "<character-id-from-test-2>",
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

### Test 4: UI Test

1. Open browser: `https://persona-sintetis.<host>.app`
2. Navigate to `/characters`
3. Click "Create Character"
4. Upload image and fill form
5. Go to `/generate`
6. Select character from dropdown
7. Adjust consistency slider
8. Click "Generate"

---

## 📊 Monitoring

### Worker Logs

```bash
wrangler tail --status error
```

### Real-time Logs

```bash
wrangler tail
```

### Supabase Logs

Dashboard → Database → Logs

---

## 🆘 Troubleshooting

### "Unauthorized" Error

- Check if secrets are set: `wrangler secret list`
- Verify API token is valid
- Re-login: `wrangler logout && wrangler login`

### "Database connection failed"

- Check SUPABASE_URL is correct
- Verify Supabase project is active
- Check RLS policies are enabled

### "AI model not found"

- Verify Cloudflare AI Gateway is enabled
- Check CLOUDFLARE_AI_API_TOKEN is set
- Go to Cloudflare Dashboard → AI → Gateway

### CORS Errors

Worker should include CORS headers. Check `worker.ts` has:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
};
```

### Build Errors

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 💰 Cost Tracking

Monitor usage:

1. **Cloudflare Workers:** Dashboard → Workers → Usage
2. **Cloudflare AI:** Dashboard → AI → Usage
3. **Supabase:** Dashboard → Settings → Usage

**Target:** <$115/month for 1000 users

---

## ✅ Deployment Complete Checklist

- [ ] Wrangler authenticated
- [ ] Secrets configured (4 secrets)
- [ ] Supabase migrations applied
- [ ] Worker deployed
- [ ] Frontend config updated
- [ ] Frontend built
- [ ] Frontend deployed
- [ ] Health check passed
- [ ] Character upload tested
- [ ] Generation tested
- [ ] UI tested end-to-end

---

## 📞 Support

If you encounter issues:

1. Check logs: `wrangler tail`
2. Review error messages
3. Check documentation:
   - `DEPLOYMENT.md`
   - `QUICKSTART.md`
   - `ARCHITECTURE-Character-Consistency.md`
4. Open GitHub issue

---

**Ready to deploy! Follow steps 1-8 above.** 🚀
