# Character Consistency - Quick Start

## 🚀 One-Command Deploy

```bash
./deploy.sh
```

Or on Windows (Git Bash):
```bash
bash deploy.sh
```

---

## 📋 Manual Steps

### 1. Install Wrangler (if not installed)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
cd workers/character-consistency
wrangler login
```

### 3. Set Secrets
```bash
wrangler secret put SUPABASE_URL
# Enter: https://<project-ref>.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Enter: <your-anon-key>

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter: <your-service-role-key>

wrangler secret put CLOUDFLARE_AI_API_TOKEN
# Enter: <your-CF-AI-token>
```

### 4. Deploy Worker
```bash
npm run deploy
```

### 5. Apply Supabase Migrations

**Option A: Via Dashboard**
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Copy and run each file from `supabase/migrations/`:
   - `001_create_character_consistency_tables.sql`
   - `002_setup_storage_buckets.sql`
   - `003_create_helper_functions.sql`

**Option B: Via CLI**
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### 6. Update Frontend Config

Edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://character-consistency-api.<subdomain>.workers.dev/api/v1',
  cloudflareAiGateway: 'https://gateway.ai.cloudflare.com/v1/<account>/<gateway>/workers-ai',
  supabaseUrl: 'https://<project>.supabase.co',
  supabaseAnonKey: '<anon-key>'
};
```

### 7. Build Frontend
```bash
npm run build
```

### 8. Test
```bash
# Start dev server
npm start

# Open browser
http://localhost:4200/characters
```

---

## 🧪 Test with curl

### Upload Character
```bash
curl -X POST http://localhost:8787/api/v1/characters \
  -F "image=@test.jpg" \
  -F "name=Ryu" \
  -F "description=Main character" \
  -F "tags=[cyberpunk,protagonist]"
```

### Generate with Character
```bash
curl -X POST http://localhost:8787/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "<id-from-upload>",
    "prompt": "Ryu running in cyberpunk city",
    "consistency_strength": 0.8
  }'
```

---

## 📚 Documentation

- **PRD:** `../../PRD-Character-Consistency.md`
- **Architecture:** `../../ARCHITECTURE-Character-Consistency.md`
- **API Docs:** `README.md`
- **Deployment:** `DEPLOYMENT.md`
- **Tests:** `../../TEST-PLAN-Character-Consistency.md`

---

## 🆘 Troubleshooting

### Worker won't deploy
```bash
wrangler whoami  # Check authentication
wrangler login   # Re-login if needed
```

### Supabase error
```bash
supabase status  # Check if running
supabase login   # Login to Supabase
```

### CORS errors
Check `worker.ts` has CORS headers enabled.

### AI model not found
Verify Cloudflare AI Gateway is enabled in dashboard.

---

## 💰 Cost Estimate

~$60-115/month for 1000 users (see DEPLOYMENT.md)

---

## ✅ Checklist

- [ ] Wrangler installed
- [ ] Cloudflare authenticated
- [ ] Secrets configured
- [ ] Worker deployed
- [ ] Supabase migrations applied
- [ ] Frontend config updated
- [ ] Frontend built
- [ ] End-to-end test passed

---

**Ready to deploy! 🎉**
