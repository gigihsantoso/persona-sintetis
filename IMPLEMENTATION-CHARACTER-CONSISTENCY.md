# Implementasi Backend API - Character Consistency

## Ringkasan Implementasi

Dokumen ini menjelaskan implementasi backend API untuk fitur **Character Consistency** pada proyek Persona Sintetis.

## Struktur File

```
persona-sintetis/
├── supabase/
│   └── migrations/
│       ├── 001_create_character_consistency_tables.sql
│       ├── 002_setup_storage_buckets.sql
│       └── 003_create_helper_functions.sql
├── workers/
│   └── character-consistency/
│       ├── src/
│       │   ├── worker.ts              # Main API entry point
│       │   ├── types.ts               # TypeScript types
│       │   └── services/
│       │       ├── character.ts       # Character service
│       │       ├── generation.ts      # Generation service
│       │       ├── storage.ts         # Storage service
│       │       └── ai.ts              # AI service (CLIP + SDXL)
│       ├── package.json
│       ├── wrangler.toml
│       ├── tsconfig.json
│       └── README.md
└── IMPLEMENTATION-CHARACTER-CONSISTENCY.md  # File ini
```

## Komponen Utama

### 1. Database Schema (Supabase)

**File:** `supabase/migrations/001_create_character_consistency_tables.sql`

Membuat dua tabel utama:

#### `characters`
- Menyimpan reference images karakter
- CLIP embedding (512 dimensions) untuk similarity matching
- Metadata: nama, deskripsi, tags
- Statistics: generation_count
- RLS policies untuk user isolation

#### `generations`
- Menyimpan hasil generate dengan character consistency
- Reference ke character (nullable)
- Similarity score untuk quality tracking
- Metadata generation: prompt, model, parameters

**Indexes:**
- IVFFlat index untuk vector similarity search
- User ID index untuk filtering
- Composite indexes untuk query performance

### 2. Storage Buckets (Supabase Storage)

**File:** `supabase/migrations/002_setup_storage_buckets.sql`

Dua bucket terpisah:

#### `reference-images`
- Path pattern: `{user_id}/{character_id}.png`
- Max size: 10MB
- Formats: JPEG, PNG, WebP
- RLS: user hanya bisa akses folder sendiri

#### `generated-images`
- Path pattern: `{user_id}/{generation_id}.png`
- Max size: 10MB
- Formats: PNG
- RLS: user hanya bisa akses folder sendiri

### 3. Helper Functions

**File:** `supabase/migrations/003_create_helper_functions.sql`

RPC functions untuk operasi kompleks:

- `increment_generation_count()` - Update counter karakter
- `get_character_with_stats()` - Get character dengan stats
- `search_characters_by_text()` - Full-text search
- `get_generation_history()` - History dengan character info
- `delete_character_full()` - Hard delete cascade
- `get_user_stats()` - Aggregated user statistics

### 4. Cloudflare Worker API

**Entry Point:** `workers/character-consistency/src/worker.ts`

Framework: **Hono** (lightweight web framework untuk Workers)

#### Middleware
- CORS untuk allowed origins
- Logging middleware
- Bearer auth (optional, untuk production)

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/characters` | Upload character + embedding |
| GET | `/api/v1/characters` | List characters (paginated) |
| GET | `/api/v1/characters/:id` | Get character details |
| PATCH | `/api/v1/characters/:id` | Update character metadata |
| DELETE | `/api/v1/characters/:id` | Delete character (soft) |
| POST | `/api/v1/characters/search` | Similarity search |
| GET | `/api/v1/characters/:id/generations` | Character generation history |
| POST | `/api/v1/generate` | Generate dengan consistency |
| GET | `/api/v1/generations` | List generations |
| GET | `/api/v1/generations/:id` | Get generation details |
| DELETE | `/api/v1/generations/:id` | Delete generation |

### 5. Services Layer

#### Character Service (`services/character.ts`)
- CRUD operations untuk characters
- Vector similarity search
- Pagination dan filtering
- Soft delete support

#### Generation Service (`services/generation.ts`)
- CRUD operations untuk generations
- Filtering by character dan status
- History queries

#### Storage Service (`services/storage.ts`)
- Upload/download images
- Signed URL generation
- Delete operations

#### AI Service (`services/ai.ts`)
- **CLIP Embedding Extraction**: `@cf/openai/clip-vit-b-32`
- **Image Generation**: `@cf/stabilityai/stable-diffusion-xl-base-1.0`
- **Cosine Similarity Calculation**
- Prompt enhancement dengan context (action, location, outfit)

## AI Pipeline

### Flow: Upload Character

```
1. User upload image via Angular UI
   ↓
2. API validate image (format, size)
   ↓
3. Upload to Supabase Storage (reference-images bucket)
   ↓
4. Extract CLIP embedding via Cloudflare AI
   ↓
5. Save character record dengan embedding ke Supabase
   ↓
6. Return character data ke client
```

### Flow: Generate dengan Consistency

```
1. User submit generation request dengan character_id
   ↓
2. API get character dari database
   ↓
3. Download reference image dari storage
   ↓
4. Create generation record (status: processing)
   ↓
5. Call Cloudflare AI dengan:
   - Prompt (enhanced dengan context)
   - Reference image (untuk IP-Adapter)
   - Parameters (strength, steps, etc.)
   ↓
6. AI generate image dengan SDXL + IP-Adapter
   ↓
7. Upload hasil generate ke storage (generated-images)
   ↓
8. Calculate similarity score (cosine similarity)
   ↓
9. Update generation record (status: completed)
   ↓
10. Increment character generation_count
   ↓
11. Return generation data ke client
```

### Flow: Similarity Search

```
1. User upload query image
   ↓
2. Extract CLIP embedding dari query image
   ↓
3. Call database function search_similar_characters()
   ↓
4. Return characters dengan similarity > threshold
   ↓
5. Sorted by similarity (descending)
```

## Authentication & Authorization

### Current Implementation
- Header-based auth: `X-User-ID`
- Simple untuk development

### Production Implementation
- JWT token dari Supabase Auth
- Bearer auth middleware
- Token verification via Supabase Auth API

### RLS Policies
Semua tabel memiliki Row Level Security:
- User hanya bisa SELECT/INSERT/UPDATE/DELETE data sendiri
- Service role key bypass RLS (untuk Cloudflare Worker)

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... },
    "suggestions": ["Suggestion 1"]
  }
}
```

### Error Codes
- `INVALID_INPUT` - Validation failed
- `INVALID_IMAGE` - Unsupported format
- `FILE_TOO_LARGE` - > 10MB
- `UNAUTHORIZED` - Missing/invalid auth
- `NOT_FOUND` - Resource not found
- `CHARACTER_NOT_FOUND` - Character not found
- `GENERATION_FAILED` - AI generation error
- `INTERNAL_ERROR` - Server error

## Deployment

### 1. Setup Supabase

```bash
# Apply migrations
psql -h <host> -U postgres -d postgres -f supabase/migrations/001_*.sql
psql -h <host> -U postgres -d postgres -f supabase/migrations/002_*.sql
psql -h <host> -U postgres -d postgres -f supabase/migrations/003_*.sql
```

### 2. Setup Cloudflare Worker

```bash
cd workers/character-consistency

# Install dependencies
npm install

# Set secrets
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# Deploy
npm run deploy
```

### 3. Update Frontend

Update Angular services untuk connect ke API baru:
- `src/app/services/character.ts`
- `src/app/services/generation.ts`

## Testing

### Manual Testing

```bash
# Health check
curl http://localhost:8787/health

# Create character
curl -X POST http://localhost:8787/api/v1/characters \
  -H "X-User-ID: test-user" \
  -F "name=Test Character" \
  -F "image=@test.jpg"

# List characters
curl http://localhost:8787/api/v1/characters \
  -H "X-User-ID: test-user"

# Generate image
curl -X POST http://localhost:8787/api/v1/generate \
  -H "X-User-ID: test-user" \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "uuid",
    "prompt": "character running"
  }'
```

## Performance Optimization

### Vector Search
- IVFFlat index dengan `lists = 100`
- Threshold filtering untuk mengurangi hasil
- Limit results untuk query performance

### Image Processing
- Resize images sebelum upload (optional)
- Generate thumbnails untuk preview
- CDN caching via Supabase Storage

### Caching Strategy
- Cache embeddings (sudah di database)
- Cache character metadata
- No cache untuk generation requests

## Monitoring & Observability

### Cloudflare Worker Analytics
- Request count
- Error rate
- Latency percentiles (p50, p95, p99)

### Logging
```typescript
console.log(`[${c.req.method}] ${c.req.path} - ${c.res.status} (${duration}ms)`);
```

### Wrangler Tail
```bash
wrangler tail --format pretty
```

## Security Considerations

1. **Input Validation** - Semua input divalidasi sebelum processing
2. **File Size Limits** - Max 10MB untuk images
3. **MIME Type Validation** - Hanya image formats yang allowed
4. **RLS Policies** - Database-level isolation
5. **CORS** - Restricted origins
6. **Rate Limiting** - Cloudflare level (to be implemented)
7. **Secret Management** - Wrangler secrets, bukan hardcode

## Future Enhancements

### Phase 2
- [ ] Multi-image reference (3-5 images per character)
- [ ] Batch generation
- [ ] Advanced similarity filters
- [ ] Character projects/folders

### Phase 3
- [ ] LoRA fine-tuning untuk better consistency
- [ ] Video generation support
- [ ] Real-time generation progress (WebSocket)
- [ ] Shared character library (team collaboration)

## Troubleshooting

### Common Issues

**1. Embedding extraction failed**
- Check Cloudflare AI model availability
- Verify image format and size
- Check AI binding configuration

**2. Vector search returns no results**
- Verify pgvector extension enabled
- Check IVFFlat index created
- Adjust similarity threshold

**3. Generation timeout**
- Increase Worker timeout (max 30s)
- Use async generation dengan polling
- Check Cloudflare AI quota

**4. RLS policy blocks access**
- Verify user_id matches auth.uid()
- Check service_role key usage
- Review policy definitions

## License

Proprietary - Persona Sintetis

## Contact

Untuk pertanyaan atau issues, hubungi tim Engineering.
