# Research Summary: Madplan v2

**Project:** Madplan App v2
**Researched:** 2025-01-24
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Key Findings

### Stack
- **Next.js 16** med Tailwind v4 og shadcn/ui
- **PWA** via native Next.js manifest + Serwist til service workers
- **Swipe:** Embla Carousel (inkluderet i shadcn/ui) + Framer Motion
- **OCR:** OpenAI Vision API via n8n (allerede brugt i v1)
- **Recipe scraping:** JSON-LD parsing via cheerio i n8n

### Features - Prioritering

**Table Stakes (v2 must-have):**
1. URL import med auto-udtrækning (JSON-LD)
2. Billede-import med OCR
3. Favoritter
4. Tags (bruger-oprettede)
5. Søg i titel

**Differentiators (v2 key feature):**
- URL-detection i billeder (unik feature - ikke set hos konkurrenter)
- Gem opskriftsbillede fra URL

**Anti-features (undgå):**
- Komplekse kategori-hierarkier → brug flade tags
- AI-forslag i v2 → derfér til v2.1
- Voice features, gamification, social → skip

### Arkitektur

```
Next.js (PWA) → API Routes (thin proxy) → n8n Webhooks → Airtable
                                              ↓
                                        OpenRouter (OCR/AI)
```

**Nøglebeslutninger:**
- Hold OCR/scraping i n8n (ikke Next.js API routes)
- API routes som tynd proxy → enabler PWA caching
- Service worker: Network-first for data, Cache-first for assets

### Pitfalls at Undgå

| Pitfall | Prevention |
|---------|------------|
| Service worker cacher API data forkert | Network-first for `/api/*` |
| OCR forventer perfekt output | Valider AI response, vis preview |
| URL scraping fejler på danske sites | Test med arla.dk, valdemarsro.dk |
| Swipe konflikter med system gestures | 20px padding fra skærmkanter |
| shadcn/ui behandles som npm package | Det er copy-paste, DU vedligeholder |

---

## Roadmap Implikationer

### Anbefalet fase-struktur:

1. **Foundation** — Next.js + Tailwind v4 + shadcn/ui setup, PWA manifest
2. **Core Features** — Forbind til eksisterende v1 n8n workflows, implementer views
3. **PWA Enhancement** — Service worker, caching strategies, swipe navigation
4. **Smart Import** — URL import UI, billede import med OCR, URL detection
5. **Organization** — Favoritter, tags, søg/filter

### Airtable udvidelser:
- `Favorit` (checkbox)
- `Tags` (multi-select)
- `BilledeUrl` (URL)
- `Kilde` (original import URL)

### n8n workflow naming:
- Alle v2 workflows tagges: `Madplan v2 - [Navn]`

---

## Confidence Levels

| Område | Confidence | Note |
|--------|------------|------|
| Stack valg | HIGH | Verificeret med officiel docs |
| PWA arkitektur | HIGH | Next.js native support |
| OCR approach | HIGH | Allerede fungerer i v1 |
| URL detection | MEDIUM | Novel feature, kræver iteration |
| Danske sites | MEDIUM | Kræver test med lokale URLs |

---

## Ready for Requirements

Research færdig. Næste skridt:
1. Definer detaljerede requirements baseret på FEATURES.md
2. Map requirements til faser baseret på ARCHITECTURE.md build order
3. Inkluder pitfall mitigations i relevante faser

---
*Research complete: 2025-01-24*
