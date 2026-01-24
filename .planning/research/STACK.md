# Stack Research: Madplan v2

**Project:** Madplan App v2
**Researched:** 2025-01-24
**Confidence:** HIGH

## Recommended Stack

| Category | Technology | Version | Confidence |
|----------|------------|---------|------------|
| **Framework** | Next.js | 16.x | HIGH |
| **Styling** | Tailwind CSS | v4.0 | HIGH |
| **Components** | shadcn/ui | Latest | HIGH |
| **PWA Manifest** | Native Next.js | - | HIGH |
| **Service Worker** | Serwist | Latest | MEDIUM |
| **Carousel/Swipe** | Embla Carousel | 9.0.0 | HIGH |
| **Animations** | Motion (Framer) | 12.x | HIGH |
| **OCR** | OpenAI Vision API | - | HIGH |
| **Recipe Parsing** | n8n + cheerio | - | HIGH |
| **Database** | Airtable | - | HIGH (existing) |
| **Backend** | n8n workflows | - | HIGH (existing) |

## Technology Details

### Framework: Next.js 16

**Why:**
- Turbopack now stable (faster dev builds)
- React Compiler support
- Native PWA manifest support via `app/manifest.ts`
- App Router mature and battle-tested

**Configuration:**
```bash
npx create-next-app@latest madplan-v2 --typescript --tailwind --app
```

### Styling: Tailwind CSS v4

**Why:**
- Oxide engine (5x faster builds)
- CSS-first configuration
- Native container queries
- Better HMR

### Components: shadcn/ui

**Why:**
- Copy-paste model (you own the code)
- Tailwind integration
- Accessible by default (Radix primitives)
- Customizable to match any design

**Key components needed:**
- `Button`, `Input`, `Card` — basics
- `Carousel` — week navigation with swipe (uses Embla)
- `Dialog`, `Sheet` — modals and drawers
- `Tabs` — view switching
- `Badge` — tags display

### PWA: Native + Serwist

**Why:**
- Next.js 16 has built-in `manifest.ts` support
- Serwist is the maintained successor to next-pwa
- Only need basic installability (offline is out of scope)

**Minimal setup:**
```typescript
// app/manifest.ts
export default function manifest() {
  return {
    name: 'Madplan',
    short_name: 'Madplan',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [...]
  }
}
```

### Swipe Gestures: Embla Carousel + Motion

**Why:**
- Embla Carousel built into shadcn/ui Carousel
- Native touch/swipe support
- Motion (Framer Motion 12) for custom gestures
- Both handle mobile edge cases well

**Use cases:**
- `Carousel` for week navigation (swipe left/right)
- `Motion` for drag-to-reorder (v2.1)

### OCR: OpenAI Vision API (via n8n)

**Why:**
- Already used in v1 via OpenRouter
- Can detect URLs in images
- Structured output for recipe extraction
- No browser-side processing needed

**Alternative considered:**
- Tesseract.js — lower accuracy, larger bundle, but free

### Recipe URL Parsing: n8n + cheerio

**Why:**
- Most recipe sites use JSON-LD (schema.org/Recipe)
- cheerio parses HTML server-side
- n8n handles the orchestration
- Keeps logic in existing workflow pattern

## What NOT to Use

| Avoid | Reason | Use Instead |
|-------|--------|-------------|
| next-pwa | Unmaintained since 2024 | Serwist or native |
| @ducanh2912/next-pwa | Deprecated | Serwist |
| react-use-gesture | Lower adoption | Framer Motion |
| Tesseract.js | Lower accuracy for recipes | OpenAI Vision |
| Puppeteer | Overkill for scraping | cheerio |
| localStorage | Size limits | IndexedDB if needed |

## Build Order Implications

1. **Foundation Phase:** Next.js + Tailwind v4 + shadcn/ui setup
2. **PWA Phase:** manifest.ts + icons + service worker basics
3. **Core Features:** Connect to v1 n8n workflows
4. **Smart Import:** OCR and URL parsing (n8n side)
5. **Organization:** Favorites and tags UI

## Open Questions

- **Tesseract.js as fallback?** Could be useful if OpenAI Vision API has downtime or cost concerns
- **Recipe-scrapers library?** Python library with 606+ sites, but requires Python runtime

---
*Research complete. Ready for requirements definition.*
