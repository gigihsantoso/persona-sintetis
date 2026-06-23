# Deployment Guide - Character Consistency API

Panduan lengkap untuk deploy backend API Character Consistency ke production.

## Prerequisites

- [ ] Akun Cloudflare dengan Workers enabled
- [ ] Akun Supabase dengan pgvector extension
- [ ] Wrangler CLI terinstall (`npm install -g wrangler`)
- [ ] Node.js 18+ terinstall

## Step 1: Setup Supabase

### 1.1 Enable pgvector Extension

Login ke Supabase dashboard dan jalankan:

```sql
-- Di SQL Editor Supabase
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 1.2 Apply Migrations

```bash
# Connect ke database Supabase
psql -h db.<project-ref>.supabase.co -U postgres -d postgres

# Atau via Supabase CLI
supabase db push
```

Jalankan migrations secara berurutan:

```bash
psql -h <host> -U postgres -d postgres -f supabase/migrations/001_create_character_consistency_tables.sql
psql -h <host> -U postgres -d postgres -f supabase/migrations/002_setup_storage_buckets.sql
psql -h <host> -U postgres -d postgres -f supabase/migrations/003_create_helper_functions.sql
```

### 1.3 Create Storage Buckets

Via Supabase Dashboard:
1. Go to Storage
2. Create new bucket: `reference-images` (public)
3. Create new bucket: `generated-images` (public)
4. Set file size limit: 10MB
5. Set allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### 1.4 Get Credentials

Catat credentials berikut dari Supabase Dashboard:
- Project URL: `https://<project-ref>.supabase.co`
- Anon/Public Key: `eyJhbG...`
- Service Role Key: `eyJhbG...` (rahasia!)

## Step 2: Setup Cloudflare Worker

### 2.1 Install Dependencies

```bash
cd workers/character-consistency
npm install
```

### 2.2 Login ke Cloudflare

```bash
wrangler login
```

### 2.3 Configure Wrangler

Edit `wrangler.toml`:

```toml
name = "character-consistency-api"
main = "src/worker.ts"
compatibility_date = "2024-06-23"

# Update dengan domain Anda
# [[routes]]
# pattern = "api.personasintetis.com/v1/*"
# zone_name = "personasintetis.com"
```

### 2.4 Set Environment Secrets

```bash
wrangler secret put SUPABASE_URL
# Input: https://<project-ref>.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Input: <anon-key>

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Input: <service-role-key>
```

### 2.5 Development Mode

```bash
npm run dev
```

API akan berjalan di `http://localhost:8787`

Test dengan:
```bash
curl http://localhost:8787/health
```

### 2.6 Deploy to Production

```bash
npm run deploy
```

Output akan menampilkan URL Worker:
```
https://character-consistency-api.<subdomain>.workers.dev
```

## Step 3: Configure Frontend

### 3.1 Update Environment File

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://character-consistency-api.<subdomain>.workers.dev/api/v1',
  // ...
};
```

### 3.2 Build Frontend

```bash
npm run build -- --configuration=production
```

### 3.3 Deploy Frontend

Deploy ke Cloudflare Pages atau hosting pilihan Anda.

## Step 4: Verification

### 4.1 Health Check

```bash
curl https://character-consistency-api.<subdomain>.workers.dev/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-06-23T..."
  }
}
```

### 4.2 Test Character Creation

```bash
curl -X POST https://.../api/v1/characters \
  -H "X-User-ID: test-user" \
  -F "name=Test Character" \
  -F "image=@test.jpg"
```

### 4.3 Test Generation

```bash
curl -X POST https://.../api/v1/generate \
  -H "X-User-ID: test-user" \
  -H "Content-Type: application/json" \
  -d '{"character_id":"<id>","prompt":"test prompt"}'
```

## Step 5: Monitoring

### 5.1 Cloudflare Worker Analytics

Dashboard: https://dash.cloudflare.com/

1. Workers & Pages → character-consistency-api
2. View Analytics:
   - Requests
   - Errors
   - CPU Time
   - Response Times

### 5.2 Real-time Logs

```bash
wrangler tail --format pretty
```

### 5.3 Supabase Logs

Dashboard: https://app.supabase.com/

1. Project → Logs
2. Filter by table: `characters`, `generations`

## Step 6: Production Checklist

### Security
- [ ] RLS policies enabled di semua tabel
- [ ] Service role key tidak terekspos di client
- [ ] CORS configured untuk production domain
- [ ] Rate limiting enabled (via Cloudflare)

### Performance
- [ ] IVFFlat index created untuk vector search
- [ ] Image compression enabled
- [ ] CDN caching configured

### Monitoring
- [ ] Error alerts configured
- [ ] Usage quotas monitored
- [ ] Backup strategy implemented

### Documentation
- [ ] API documentation updated
- [ ] Runbook untuk troubleshooting
- [ ] Contact person untuk on-call

## Troubleshooting

### Issue: Worker deployment failed

**Solution:**
```bash
wrangler deploy --dry-run
# Check error messages
wrangler deploy
```

### Issue: Database connection error

**Solution:**
- Verify SUPABASE_URL correct
- Check Supabase project status
- Verify network connectivity

### Issue: RLS policy blocks access

**Solution:**
- Use service_role key untuk Worker
- Verify user_id matches auth.uid()
- Check policy definitions

### Issue: AI model unavailable

**Solution:**
- Check Cloudflare AI status
- Verify model name correct
- Check quota limits

## Cost Estimation

### Cloudflare Workers
- Free tier: 100K requests/day
- Paid: $0.15 per 1M requests

### Cloudflare AI
- Free tier: 1000 inference/month
- Paid: Pay per inference

### Supabase
- Free tier: 500MB database, 1GB storage
- Pro: $25/month (unlimited database, 100GB storage)

## Rollback Plan

Jika deployment bermasalah:

```bash
# Rollback ke deployment sebelumnya
wrangler rollback

# Atau deploy specific version
wrangler deploy --version <version-id>
```

## Support

Untuk issues atau pertanyaan:
- GitHub Issues: https://github.com/...
- Email: engineering@personasintetis.com

---

**Last Updated:** 2026-06-23
**Version:** 1.0
