# Character Consistency API

Cloudflare Worker API untuk fitur Character Consistency pada Persona Sintetis.

## Arsitektur

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Angular UI    │────▶│  Cloudflare Worker   │────▶│   Supabase      │
│                 │     │  (API Layer)         │     │   (DB + Storage)│
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────────┐
                        │  Cloudflare AI       │
                        │  - CLIP Embedding    │
                        │  - SDXL Generation   │
                        └──────────────────────┘
```

## Setup

### 1. Install Dependencies

```bash
cd workers/character-consistency
npm install
```

### 2. Configure Environment Variables

Set secrets via Wrangler CLI:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### 3. Run Supabase Migrations

```bash
# Connect to your Supabase project and run:
psql -h <host> -U postgres -d postgres -f supabase/migrations/001_create_character_consistency_tables.sql
psql -h <host> -U postgres -d postgres -f supabase/migrations/002_setup_storage_buckets.sql
```

### 4. Development

```bash
npm run dev
```

API akan berjalan di `http://localhost:8787`

### 5. Deploy

```bash
npm run deploy
```

## API Endpoints

### Health Check

```http
GET /health
```

### Characters

#### Create Character
```http
POST /api/v1/characters
Content-Type: multipart/form-data
X-User-ID: {user_id}

{
  "name": "Ryu",
  "description": "Protagonist cyberpunk",
  "tags": "pria,rambut hitam,cyberpunk",
  "image": <file>,
  "default_strength": 0.8
}
```

#### List Characters
```http
GET /api/v1/characters?limit=20&offset=0&search=ryu&sort=created_at&order=desc
X-User-ID: {user_id}
```

#### Get Character
```http
GET /api/v1/characters/{id}
X-User-ID: {user_id}
```

#### Update Character
```http
PATCH /api/v1/characters/{id}
X-User-ID: {user_id}
Content-Type: application/json

{
  "name": "Ryu Updated",
  "tags": ["pria", "cyberpunk", "updated"]
}
```

#### Delete Character
```http
DELETE /api/v1/characters/{id}
X-User-ID: {user_id}
```

#### Search Similar Characters
```http
POST /api/v1/characters/search
X-User-ID: {user_id}
Content-Type: application/json

{
  "image": <base64>,
  "limit": 10,
  "threshold": 0.5
}
```

#### Get Character Generations
```http
GET /api/v1/characters/{id}/generations?limit=20&offset=0
X-User-ID: {user_id}
```

### Generations

#### Generate Image
```http
POST /api/v1/generate
X-User-ID: {user_id}
Content-Type: application/json

{
  "character_id": "uuid",
  "prompt": "Ryu berlari di kota cyberpunk",
  "negative_prompt": "buruk, blur, distorsi",
  "action": "running",
  "location": "cyberpunk city",
  "outfit": "casual techwear",
  "consistency_strength": 0.85,
  "width": 1024,
  "height": 1024
}
```

#### List Generations
```http
GET /api/v1/generations?character_id={id}&status=completed&limit=20
X-User-ID: {user_id}
```

#### Get Generation
```http
GET /api/v1/generations/{id}
X-User-ID: {user_id}
```

#### Delete Generation
```http
DELETE /api/v1/generations/{id}
X-User-ID: {user_id}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 100,
    "has_more": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Character name is required",
    "details": { ... },
    "suggestions": ["Provide a valid name"]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Invalid request parameters |
| `INVALID_IMAGE` | 400 | Unsupported image format |
| `FILE_TOO_LARGE` | 413 | Image exceeds 10MB limit |
| `UNAUTHORIZED` | 401 | Missing or invalid X-User-ID |
| `NOT_FOUND` | 404 | Resource not found |
| `CHARACTER_NOT_FOUND` | 404 | Character not found |
| `GENERATION_FAILED` | 500 | AI generation failed |
| `INTERNAL_ERROR` | 500 | Server error |

## AI Pipeline

### 1. Embedding Extraction
- Model: CLIP ViT-B/32 (`@cf/openai/clip-vit-b-32`)
- Dimensions: 512
- Input: Image (JPEG/PNG/WebP)
- Output: Float32Array[512]

### 2. Image Generation
- Model: SDXL Turbo (`@cf/stabilityai/stable-diffusion-xl-base-1.0`)
- Conditioning: IP-Adapter dengan reference image
- Resolution: 1024x1024 (default)
- Steps: 25 (default)

### 3. Similarity Calculation
- Method: Cosine Similarity
- Range: 0-1 (1 = identical)
- Threshold: 0.5 (minimum untuk match)

## Database Schema

### Tables
- `characters` - Character reference dengan embedding
- `generations` - Generated images dengan metadata

### Indexes
- `characters_embedding_idx` - IVFFlat index untuk vector search
- `characters_user_id_idx` - User filtering
- `generations_character_id_idx` - Character lookup

### RLS Policies
Semua tabel memiliki Row Level Security yang memastikan user hanya bisa mengakses data mereka sendiri.

## Storage Buckets

### reference-images
- Path: `{user_id}/{character_id}.png`
- Max size: 10MB
- Formats: JPEG, PNG, WebP

### generated-images
- Path: `{user_id}/{generation_id}.png`
- Max size: 10MB
- Formats: PNG

## Monitoring

```bash
# View real-time logs
wrangler tail

# View deployment history
wrangler deployments list
```

## Rate Limiting

Rate limiting akan diimplementasikan di Cloudflare level:
- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise: Custom limits

## Security

- JWT authentication (via Supabase Auth)
- RLS policies untuk data isolation
- CORS configured untuk allowed origins
- Input validation untuk semua endpoints

## License

Proprietary - Persona Sintetis
