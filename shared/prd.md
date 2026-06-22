# 📋 Persona Sintetis - Product Requirements Document

## Metadata
- **Status:** Draft
- **Date:** 2026-06-22
- **Target Release:** MVP v1.0

---

## 1. Context & Problem

### Problem Statement
Untuk content creator yang perlu membuat multiple images dengan karakter yang sama, masalah inkonsistensi karakter antar generate adalah frustrasi utama.

### Solution
Persona Sintetis menyediakan **Character Sheet lengkap** dengan **persona persistence** untuk konsistensi karakter realistis dan可控.

---

## 2. Goals & Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Weekly Active Creators | 500 | Analytics |
| Character Retention Rate | 80% | Same character ≥3 images |
| NPS Score | ≥40 | In-app survey |

---

## 3. Core Features

### Epic 1: Character Sheet Creation
- Form input (Nama, Deskripsi, Penampilan, Kepribadian, Pakaian, Latar Belakang)
- Auto-generate description via AI
- Upload reference images (1-5 images)

### Epic 2: Image Generation dengan Character Consistency
- Generate image pakai character sheet
- Character consistency score (ML-based)
- Multi-character scene (2-5 characters)

### Epic 3: Gallery & Management
- Gallery dengan character filter
- Export PDF/JSON
- Duplicate character

### Epic 4: Subscription
- Free: 3 chars, 10 images/month
- Pro: Unlimited + HD + commercial license

---

## 4. Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 21 + Tailwind v4 |
| Backend | Supabase (Auth, DB, Storage) |
| AI | Cloudflare Workers AI (FLUX.1) + Ollama (GLM-5.2) |
| Deploy | Cloudflare Tunnel |

---

## 5. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Bagaimana calculate consistency score? | Architect | Open |
| 2 | Pricing: $10 atau $15/mo? | PM | Discussion |
| 3 | Support batch generate? | Backend | Open |

---

**Last Updated:** 2026-06-22
**Updated By:** PM (GLM-5.2)
