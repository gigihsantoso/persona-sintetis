# 🏗️ System Architecture - Persona Sintetis MVP

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Angular 21)                   │
│  - Character Sheet Form                                     │
│  - Image Generator                                          │
│  - Gallery                                                  │
│  - Tailwind v4 Styling                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Supabase)                          │
│  - Auth: Supabase Auth (JWT)                                │
│  - Database: PostgreSQL                                     │
│  - Edge Functions: API endpoints                            │
│  - Storage: Cloudflare R2 (via S3-compatible API)           │
└─────────────────────────────────────────────────────────────┘
                            ↓ API
┌─────────────────────────────────────────────────────────────┐
│                  AI Layer (Cloudflare AI Gateway)           │
│  - FLUX.1 Schnell: Image generation                         │
│  - GLM-5.2 (Ollama): Character description enhancement      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure                                 │
│  - Cloudflare Tunnel: app.pesonasintetis.xyz → localhost:4300│
│  - Express Server: Serve Angular production build           │
│  - Cloudflare R2: Image storage                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Technology | Details |
|-------|------------|---------|
| Frontend | Angular 21 + Tailwind v4 | SPA with lazy loading |
| Backend | Supabase | Auth, DB, Edge Functions |
| Database | PostgreSQL (Supabase) | RLS-enabled tables |
| AI Image Gen | Cloudflare AI Gateway | FLUX.1 Schnell model |
| AI Text | Ollama Cloud | GLM-5.2 for descriptions |
| Storage | Cloudflare R2 | S3-compatible object storage |
| Deploy | Cloudflare Tunnel | Secure tunnel to localhost |

---

## Environment Configuration

### Supabase Connection
```
SUPABASE_URL=https://dotuthgdpahgmqcizdcr.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

### Cloudflare AI Gateway
```
CLOUDFLARE_AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/<account_id>/<gateway_id>/workers-ai
CLOUDFLARE_AI_API_TOKEN=cfut_YOUR_TOKEN_HERE
```

### Cloudflare R2 Storage
```
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<access_key>
R2_SECRET_ACCESS_KEY=<secret_key>
R2_BUCKET_NAME=persona-sintetis-images
```

---

## Data Model

### Characters Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  penampilan TEXT,
  kepribadian TEXT,
  pakaian TEXT,
  latar_belakang TEXT,
  auto_description TEXT,
  reference_images TEXT[],  -- Array of R2 URLs
  consistency_seed INTEGER,  -- Base seed for consistency
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);

-- RLS Policy
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);
```

### Generations Table
```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT DEFAULT 'blurry, low quality, distorted, deformed',
  image_url TEXT NOT NULL,  -- R2 URL
  image_path TEXT NOT NULL,  -- R2 object key
  consistency_score FLOAT CHECK (consistency_score >= 0 AND consistency_score <= 1),
  seed INTEGER,
  width INTEGER DEFAULT 1024,
  height INTEGER DEFAULT 1024,
  model TEXT DEFAULT '@cf/black-forest-labs/flux-1-schnell',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_character_id ON generations(character_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- RLS Policy
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  USING (auth.uid() = user_id);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'pro'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  images_used INTEGER DEFAULT 0,
  images_limit INTEGER DEFAULT 10,
  characters_limit INTEGER DEFAULT 3,
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);

-- RLS Policy
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can update all (for webhook handlers)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

### Usage Tracking Table (Optional for Analytics)
```sql
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,  -- 'character_create', 'image_generate', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_action ON usage_logs(action);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);
```

---

## API Endpoints (Supabase Edge Functions)

### Base URL
```
https://dotuthgdpahgmqcizdcr.supabase.co/functions/v1/
```

### Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/characters` | GET | List user's characters | Required |
| `/characters` | POST | Create new character | Required |
| `/characters/:id` | GET | Get character by ID | Required |
| `/characters/:id` | PUT | Update character | Required |
| `/characters/:id` | DELETE | Delete character | Required |
| `/generate` | POST | Generate image | Required |
| `/generations` | GET | List user's generations | Required |
| `/generations/:id` | DELETE | Delete generation | Required |
| `/subscription` | GET | Get user's subscription | Required |
| `/subscription/upgrade` | POST | Upgrade to Pro | Required |
| `/upload-url` | POST | Get presigned R2 upload URL | Required |

### Request/Response Formats

#### GET /characters
```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "nama": "Character Name",
      "deskripsi": "...",
      "penampilan": "...",
      "reference_images": ["https://r2/..."],
      "created_at": "2026-06-22T10:00:00Z"
    }
  ],
  "count": 5
}
```

#### POST /characters
```json
// Request
{
  "nama": "Character Name",
  "deskripsi": "Brief description",
  "penampilan": "Physical appearance",
  "kepribadian": "Personality traits",
  "pakaian": "Clothing style",
  "latar_belakang": "Background story",
  "reference_images": ["r2-key-1", "r2-key-2"]
}

// Response 201
{
  "id": "uuid",
  "nama": "Character Name",
  "created_at": "2026-06-22T10:00:00Z"
}
```

#### POST /generate
```json
// Request
{
  "character_id": "uuid",
  "prompt": "sedang minum kopi di kafe",
  "negative_prompt": "blurry, low quality, distorted",
  "seed": 12345,
  "width": 1024,
  "height": 1024
}

// Response 202 (Accepted - async)
{
  "generation_id": "uuid",
  "status": "processing",
  "estimated_time_seconds": 30
}

// Webhook/Callback when complete
{
  "generation_id": "uuid",
  "status": "completed",
  "image_url": "https://r2/...",
  "consistency_score": 0.85,
  "seed": 12345
}
```

#### GET /generations
```json
// Query params: ?character_id=uuid&limit=20&offset=0
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "character_id": "uuid",
      "prompt": "...",
      "image_url": "https://r2/...",
      "consistency_score": 0.85,
      "created_at": "2026-06-22T10:00:00Z"
    }
  ],
  "count": 50,
  "has_more": true
}
```

#### POST /upload-url
```json
// Request
{
  "filename": "character-ref-1.png",
  "content_type": "image/png"
}

// Response 200
{
  "upload_url": "https://<bucket>.r2.cloudflarestorage.com/...?X-Amz-...",
  "file_key": "user-id/character-id/filename",
  "public_url": "https://pub-<bucket>.r2.dev/..."
}
```

---

## Cloudflare AI Gateway Integration

### FLUX.1 Schnell Configuration

```typescript
// Edge Function: generate-image
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/' + 
  '<account_id>/' + 
  '<gateway_id>' + 
  '/workers-ai/run/@cf/black-forest-labs/flux-1-schnell';

async function generateImage(prompt: string, options: {
  seed?: number;
  width?: number;
  height?: number;
  steps?: number;
}) {
  const response = await fetch(AI_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('CLOUDFLARE_AI_API_TOKEN')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt,
      seed: options.seed ?? Math.floor(Math.random() * 2147483647),
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      steps: options.steps ?? 4  // FLUX.1 Schnell is fast, 4 steps sufficient
    })
  });

  if (!response.ok) {
    throw new Error(`AI Gateway error: ${response.statusText}`);
  }

  const result = await response.json();
  return result;  // Contains image as base64 or URL
}
```

### Character Consistency Prompt Template

```typescript
function buildCharacterPrompt(character: Character, scenePrompt: string): string {
  return `
Generate a photorealistic image of ${character.nama}.

CHARACTER REFERENCE (MUST MAINTAIN EXACTLY):
- Appearance: ${character.penampilan}
- Personality expression: ${character.kepribadian}
- Clothing: ${character.pakaian}
- Background: ${character.latar_belakang}

SCENE:
${scenePrompt}

IMPORTANT: Maintain exact facial features, hair color and style, 
body type, and distinctive characteristics from the character reference.
The character should look like the same person in all generated images.

Style: Photorealistic, high quality, professional photography
`;
}
```

### Ollama GLM-5.2 Integration (Character Enhancement)

```typescript
// Edge Function: enhance-character-description
const OLLAMA_API = 'https://api.ollama.cloud/v1/chat/completions';

async function enhanceDescription(characterData: Partial<Character>) {
  const response = await fetch(OLLAMA_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OLLAMA_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-5.2',
      messages: [{
        role: 'user',
        content: `Enhance this character description for image generation:
Nama: ${characterData.nama}
Deskripsi: ${characterData.deskripsi}
Penampilan: ${characterData.penampilan}

Provide detailed, visual-focused description optimized for AI image generation.`
      }]
    })
  });

  const result = await response.json();
  return result.choices[0].message.content;
}
```

---

## Cloudflare R2 Storage Integration

### Storage Structure
```
persona-sintetis-images/
├── {user_id}/
│   ├── characters/
│   │   └── {character_id}/
│   │       ├── reference-1.png
│   │       ├── reference-2.png
│   │       └── avatar.png
│   └── generations/
│       ├── {generation_id}.png
│       └── {generation_id}.png
└── public/
    └── marketing/
        └── samples/
```

### Presigned URL Generation

```typescript
// Edge Function: upload-url
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: Deno.env.get('R2_ENDPOINT'),
  credentials: {
    accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID')!,
    secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY')!
  }
});

async function getUploadUrl(filename: string, contentType: string, userId: string) {
  const fileKey = `${userId}/characters/${crypto.randomUUID()}/${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: Deno.env.get('R2_BUCKET_NAME'),
    Key: fileKey,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600  // 1 hour
  });

  const publicUrl = `https://pub-${Deno.env.get('R2_BUCKET_NAME')}.r2.dev/${fileKey}`;

  return { uploadUrl, fileKey, publicUrl };
}
```

### Image Retrieval with Signed URLs

```typescript
// For private images, generate signed URLs on-demand
async function getSignedImageUrl(fileKey: string, expiresIn = 3600) {
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

  const command = new GetObjectCommand({
    Bucket: Deno.env.get('R2_BUCKET_NAME'),
    Key: fileKey
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}
```

---

## Character Consistency Strategy

### Multi-Layer Approach

#### Layer 1: Structured Prompt Engineering
- Fixed character attributes in every prompt
- Explicit consistency instructions
- Seed persistence per character

#### Layer 2: Reference Image Guidance
- Upload 1-5 reference images per character
- Store reference image URLs in character record
- Include reference images in generation request (if model supports)

#### Layer 3: Seed Persistence
```typescript
// When creating a character, generate a base seed
const baseSeed = Math.floor(Math.random() * 2147483647);

// Store in character record
await supabase.from('characters').update({
  consistency_seed: baseSeed
}).eq('id', characterId);

// Use seed offset for variations
const generationSeed = baseSeed + generationCount;
```

#### Layer 4: Consistency Score (Post-Generation)
```typescript
// Calculate similarity between new image and reference
async function calculateConsistencyScore(
  newImageUrl: string,
  referenceImageUrls: string[]
): Promise<number> {
  // Use CLIP embeddings via Cloudflare AI
  const newEmbedding = await getClipEmbedding(newImageUrl);
  const refEmbeddings = await Promise.all(
    referenceImageUrls.map(url => getClipEmbedding(url))
  );

  // Average cosine similarity
  const similarities = refEmbeddings.map(ref =>
    cosineSimilarity(newEmbedding, ref)
  );

  return similarities.reduce((a, b) => a + b, 0) / similarities.length;
}
```

---

## Subscription Tiers

| Feature | Free | Pro |
|---------|------|-----|
| Characters | 3 | Unlimited |
| Images/Month | 10 | Unlimited |
| Image Resolution | 1024x1024 | Up to 2048x2048 |
| Consistency Score | Basic | Advanced ML |
| Commercial License | ❌ | ✅ |
| Priority Queue | ❌ | ✅ |
| API Access | ❌ | ✅ |

### Subscription Enforcement

```typescript
// Middleware for checking subscription limits
async function checkSubscriptionLimit(
  userId: string,
  action: 'character_create' | 'image_generate'
) {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!subscription) {
    // Create default free subscription
    return { tier: 'free', characters_limit: 3, images_limit: 10 };
  }

  if (action === 'character_create') {
    const { count } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count >= subscription.characters_limit) {
      throw new Error('Character limit reached');
    }
  }

  if (action === 'image_generate') {
    if (subscription.images_used >= subscription.images_limit) {
      throw new Error('Image generation limit reached');
    }
  }

  return subscription;
}
```

---

## Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Auth | Supabase JWT with RLS |
| Data Encryption | At rest (Supabase + R2) |
| API Security | Rate limiting, input validation |
| Image URLs | Signed URLs with expiry |
| Privacy | User data isolation via RLS |
| CORS | Restricted to app domain |
| Rate Limiting | Cloudflare AI Gateway built-in |

### RLS Policies Summary

All tables have Row Level Security enabled with policies that:
1. Users can only SELECT/INSERT/UPDATE/DELETE their own records
2. Service role has full access (for Edge Functions)
3. No public access to any data

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Image Generation | <30s | Async processing, progress polling |
| Page Load | <3s | Angular AOT, lazy loading, CDN |
| API Response | <500ms | Edge functions, caching |
| Concurrent Users | 100+ | Cloudflare scaling |
| Image Upload | <5s | Direct R2 upload (presigned URLs) |

---

## Error Handling

### Error Codes

| Code | Description | Client Action |
|------|-------------|---------------|
| `AUTH_REQUIRED` | No valid JWT | Redirect to login |
| `LIMIT_REACHED` | Subscription limit exceeded | Show upgrade prompt |
| `AI_SERVICE_ERROR` | Cloudflare AI unavailable | Retry with backoff |
| `STORAGE_ERROR` | R2 upload/download failed | Retry or show error |
| `INVALID_INPUT` | Validation failed | Show field errors |

### Retry Strategy

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unexpected retry exit');
}
```

---

## Deployment Architecture

```
User Browser
     ↓ HTTPS
Cloudflare CDN
     ↓
Cloudflare Tunnel
     ↓
Local Express Server (port 4300)
     ├── Serve Angular static files
     └── Proxy to Supabase

Supabase Edge Functions
     ├── Cloudflare AI Gateway → FLUX.1
     ├── Ollama Cloud → GLM-5.2
     └── Cloudflare R2 → Image storage
```

### Local Development

```bash
# Start Angular dev server
ng serve --port 4300

# Start Cloudflare Tunnel
cloudflared tunnel --config config.yml run persona-sintetis

# Supabase functions (local)
supabase functions serve --env-file .env
```

---

## Open Technical Decisions

| # | Decision | Options | Status |
|---|----------|---------|--------|
| 1 | Consistency score ML model | CLIP (Cloudflare) vs Custom | CLIP via AI Gateway |
| 2 | Image storage | Supabase Storage vs R2 | R2 (cost + flexibility) |
| 3 | Async generation | Queue vs Polling | Polling with status endpoint |
| 4 | Payment provider | Stripe vs Lemon Squeezy | Stripe (familiar) |

---

**Last Updated:** 2026-06-22  
**Version:** 1.0.0  
**Status:** MVP Ready
