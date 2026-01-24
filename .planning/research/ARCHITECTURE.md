# Architecture Patterns

**Project:** Madplan v2 - Meal Planning PWA
**Researched:** 2026-01-24
**Confidence:** HIGH (verified with existing v1 patterns + current official documentation)

## Executive Summary

Madplan v2 follows a **three-tier architecture** where Next.js serves as the frontend and BFF (Backend-for-Frontend), n8n handles all business logic and external integrations, and Airtable provides persistent storage. This architecture is proven from v1 and extends cleanly to support PWA capabilities, OCR processing, and URL scraping.

**Key architectural decisions:**
1. Keep OCR/scraping logic in n8n (not Next.js) - matches existing pattern, centralized logic
2. Use Next.js API routes as thin proxy layer for PWA caching strategies
3. Leverage Claude/OpenRouter vision API for smart OCR with URL detection
4. PWA manifest and service worker in Next.js for installability and caching

## System Architecture

```
                                     +-----------------+
                                     |   Airtable DB   |
                                     |  (Persistence)  |
                                     +--------+--------+
                                              ^
                                              | CRUD
                                              v
+------------------+    HTTPS     +-------------------+    HTTPS    +------------------+
|   Next.js PWA    |------------>|   n8n Workflows   |------------>|   OpenRouter     |
|   (Frontend +    |<------------|   (Business       |<------------|   Claude Vision  |
|    BFF Layer)    |   JSON      |    Logic)         |   AI/OCR    |   (AI Services)  |
+------------------+             +-------------------+             +------------------+
        |
        | Service Worker
        v
+------------------+
|  Browser Cache   |
|  (Offline Data)  |
+------------------+
```

## Component Boundaries

| Component | Responsibility | Communicates With | Technology |
|-----------|----------------|-------------------|------------|
| **Next.js App** | UI rendering, PWA shell, API proxy, client state | n8n via webhooks, Browser cache | Next.js 15+, React, shadcn/ui |
| **Service Worker** | Caching, offline support, background sync | Next.js app, Browser cache | Serwist/Workbox |
| **n8n Workflows** | Business logic, data transformation, AI orchestration | Airtable, OpenRouter, external URLs | n8n Cloud |
| **Airtable** | Data persistence, simple queries | n8n workflows | Airtable API |
| **OpenRouter** | AI model access (Claude vision for OCR) | n8n workflows | OpenRouter API |

## Data Flow Patterns

### Pattern 1: Standard CRUD (Existing v1 Pattern)

```
User Action → Next.js → n8n Webhook → Airtable → n8n → Next.js → UI Update
```

**Example:** Fetch week plan
1. User navigates to week 4
2. Next.js calls `/api/uge?ejerId=xxx&aar=2026&uge=4`
3. API route proxies to n8n webhook
4. n8n queries Airtable for week data
5. n8n returns formatted JSON
6. Next.js updates UI

### Pattern 2: OCR Image Import (New for v2)

```
User Upload → Next.js → n8n Webhook → OpenRouter Vision → n8n Parse → Next.js → UI
                                            |
                                            v (if URL detected)
                                      n8n URL Scrape → HTML Parse
```

**Flow:**
1. User uploads/takes photo of recipe
2. Next.js converts to base64, sends to `/api/import/billede`
3. API route proxies to n8n `import-billede` webhook
4. n8n sends image to OpenRouter Claude Vision API
5. Claude extracts text OR detects URL in image
6. If URL detected: n8n chains to URL scrape workflow
7. If text: n8n parses and structures recipe
8. Return structured recipe JSON to Next.js
9. User reviews/edits before saving

### Pattern 3: URL Scraping (Existing v1, Enhanced for v2)

```
User Pastes URL → Next.js → n8n Webhook → HTTP Fetch → Parse JSON-LD/HTML → Next.js
```

**Enhancement for v2:** Better JSON-LD Recipe schema parsing, fallback to AI extraction.

### Pattern 4: PWA Offline Pattern

```
User Action → Service Worker Intercept → Cache Check
                    |                        |
                    v (cache hit)            v (cache miss)
              Return Cached Data        Network Request → Cache Update → Return
```

**Caching Strategy by Request Type:**
| Request Type | Strategy | Rationale |
|--------------|----------|-----------|
| Static assets (JS, CSS, images) | Cache-first | Rarely changes, fast loads |
| Recipe list | Stale-while-revalidate | Show immediately, update in background |
| Week plan | Network-first with cache fallback | Should be fresh, but work offline |
| Import operations | Network-only | Requires external services |

## Where OCR/Scraping Logic Lives

**Recommendation: Keep in n8n** (not Next.js API routes)

### Rationale

| Factor | n8n | Next.js API Routes |
|--------|-----|-------------------|
| **Existing pattern** | Already implemented in v1 | Would require rewrite |
| **Timeout handling** | Long-running workflows OK | Serverless timeouts (10-60s) |
| **AI credentials** | Centralized in n8n | Need to manage in Vercel |
| **Debugging** | n8n execution logs, visual flow | Harder to debug |
| **Iteration speed** | Update workflow, test immediately | Deploy cycle required |
| **Code reuse** | Same workflow for URL from image | Separate logic paths |

### Implementation in n8n

**Image Import Workflow (enhanced for v2):**
```
Webhook → Code (Prepare Vision Request) → HTTP Request (OpenRouter)
    → Code (Parse Response + Detect URL)
        → IF URL Detected: Execute Workflow (URL Import) → Respond
        → IF Recipe Text: Parse & Structure → Respond
```

**Key enhancement:** Add URL detection regex in parse step:
```javascript
// Detect URL in OCR result
const urlRegex = /(https?:\/\/[^\s]+)/g;
const urls = content.match(urlRegex);
if (urls && urls.length > 0) {
    // Found URL - chain to URL import workflow
    return { type: 'url', url: urls[0] };
}
// No URL - parse as recipe text
return { type: 'text', content: content };
```

## Component Architecture (Next.js)

### Recommended Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with PWA meta
│   ├── manifest.ts               # PWA manifest (dynamic)
│   ├── page.tsx                  # Home/redirect to week
│   ├── uge/
│   │   └── [aar]/[uge]/
│   │       └── page.tsx          # Week view
│   ├── opskrifter/
│   │   └── page.tsx              # Recipe list
│   ├── import/
│   │   └── page.tsx              # Import UI (URL + image)
│   ├── indkob/
│   │   └── page.tsx              # Shopping list
│   └── api/                      # BFF proxy routes
│       ├── uge/route.ts
│       ├── opskrifter/route.ts
│       ├── import/
│       │   ├── url/route.ts
│       │   └── billede/route.ts
│       └── indkob/route.ts
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── week/                     # Week-specific components
│   │   ├── WeekView.tsx
│   │   ├── DayCard.tsx
│   │   └── WeekNavigation.tsx
│   ├── recipe/                   # Recipe components
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeForm.tsx
│   │   └── RecipeImport.tsx
│   ├── shopping/                 # Shopping list components
│   └── layout/                   # Layout components
│       ├── MobileNav.tsx
│       └── Header.tsx
├── lib/
│   ├── api.ts                    # API client for n8n
│   ├── utils.ts                  # Utilities (cn, etc.)
│   └── hooks/                    # Custom React hooks
│       ├── useWeek.ts
│       └── useRecipes.ts
├── types/
│   └── index.ts                  # TypeScript types
└── public/
    ├── icons/                    # PWA icons
    └── sw.js                     # Service worker (generated)
```

### API Route Pattern (BFF Proxy)

```typescript
// src/app/api/uge/route.ts
import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ejerId = searchParams.get('ejerId');
    const aar = searchParams.get('aar');
    const uge = searchParams.get('uge');

    const response = await fetch(
        `${N8N_BASE_URL}/madplan/uge?ejerId=${ejerId}&aar=${aar}&uge=${uge}`,
        { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    const data = await response.json();
    return NextResponse.json(data);
}
```

## PWA Architecture

### Manifest Configuration

```typescript
// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Madplan',
        short_name: 'Madplan',
        description: 'Planlæg ugens måltider',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
    };
}
```

### Service Worker Strategy

Use **Serwist** (Workbox successor recommended for Next.js 15+) or **@ducanh2912/next-pwa**.

```javascript
// serwist.config.js
export default {
    swSrc: 'src/sw.ts',
    swDest: 'public/sw.js',
    runtimeCaching: [
        {
            urlPattern: /^\/api\/uge/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'week-data',
                expiration: { maxAgeSeconds: 60 * 60 }, // 1 hour
            },
        },
        {
            urlPattern: /^\/api\/opskrifter/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'recipes',
                expiration: { maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
            },
        },
        {
            urlPattern: /^\/api\/import/,
            handler: 'NetworkOnly', // No caching for imports
        },
    ],
};
```

## n8n Workflow Structure for v2

### Naming Convention

All v2 workflows tagged with `ver2` in name:
- `Madplan v2 - Hent Uge`
- `Madplan v2 - Import Opskrift Billede`
- etc.

### Enhanced Import Workflow (Billede)

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Webhook   │────▶│ Prepare Vision  │────▶│ OpenRouter API   │
│   (POST)    │     │ Request (Code)  │     │ (Claude Sonnet)  │
└─────────────┘     └─────────────────┘     └────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌──────────────────┐
                                            │ Parse + Detect   │
                                            │ URL (Code)       │
                                            └────────┬─────────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                                    ▼                ▼                ▼
                            [URL Detected]    [Recipe Text]    [Parse Error]
                                    │                │                │
                                    ▼                ▼                ▼
                            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                            │ Execute URL │  │ Structure   │  │ Error       │
                            │ Import      │  │ Recipe      │  │ Response    │
                            └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
                                   │                │                │
                                   └────────────────┼────────────────┘
                                                    ▼
                                            ┌─────────────────┐
                                            │ Respond to      │
                                            │ Webhook         │
                                            └─────────────────┘
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Putting AI Logic in Next.js API Routes
**Why bad:** Serverless timeouts, credential management, harder to debug
**Instead:** Keep AI calls in n8n where timeouts are configurable and execution is logged

### Anti-Pattern 2: Direct Airtable Access from Frontend
**Why bad:** Exposes API keys, no business logic layer, harder to change DB later
**Instead:** Always proxy through n8n workflows

### Anti-Pattern 3: Caching Import Operations
**Why bad:** Imports are unique operations that should always hit the network
**Instead:** Use NetworkOnly caching strategy for `/api/import/*`

### Anti-Pattern 4: Fat API Routes
**Why bad:** Duplicates logic that could be in n8n, harder to maintain
**Instead:** Keep API routes thin - just proxy to n8n with minimal transformation

### Anti-Pattern 5: Mixing Server and Client State for Recipes
**Why bad:** Data inconsistencies, complex synchronization
**Instead:** Server is source of truth, client caches for offline, clear sync patterns

## Build Order (Dependencies)

Based on component dependencies, the recommended build order is:

### Phase 1: Foundation (No Dependencies)
1. **Next.js project setup** with TypeScript, shadcn/ui
2. **PWA manifest** (can be added to empty project)
3. **Basic layout** with mobile navigation

### Phase 2: Core Data Flow (Depends on Phase 1)
4. **API proxy routes** to existing v1 n8n workflows
5. **Week view** consuming API
6. **Recipe list** consuming API
7. **Shopping list** consuming API

### Phase 3: PWA Enhancement (Depends on Phase 2)
8. **Service worker** with caching strategies
9. **Swipe navigation** for weeks
10. **App shell** optimization

### Phase 4: Smart Import (Depends on Phase 2)
11. **URL import UI** (connects to existing v1 workflow)
12. **Image import UI** with camera access
13. **Enhanced n8n workflow** for URL detection in images
14. **Recipe review/edit** before save

### Phase 5: Organization (Depends on Phase 4)
15. **Favorites** (Airtable field + UI)
16. **Tags/categories** (Airtable field + UI)
17. **Search/filter** (client-side or n8n)

## Airtable Schema Extensions for v2

Minimal changes to support v2 features:

### Opskrifter Table Additions
| Field | Type | Purpose |
|-------|------|---------|
| Favorit | Checkbox | Mark as favorite |
| Tags | Multi-select | Kategorier (Hurtig, Vegetar, etc.) |
| BilledeUrl | URL | Recipe image if available |
| Kilde | Single line text | Original URL if imported |

## Technology Choices Summary

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 15+ App Router | PWA support, RSC, shadcn/ui compatibility |
| **UI** | shadcn/ui + Tailwind | Mobile-first, customizable, good DX |
| **PWA** | Native Next.js + Serwist | Official support, modern service worker |
| **State** | React Query / SWR | Caching, revalidation, optimistic updates |
| **Backend** | n8n Cloud | Existing infrastructure, workflow debugging |
| **AI/OCR** | OpenRouter + Claude Sonnet | Already integrated in v1, vision capabilities |
| **Database** | Airtable | Existing data, simple schema, no migration needed |

## Sources

### PWA Architecture
- [Next.js Official PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Building PWA with Next.js 2025](https://medium.com/@jakobwgnr/how-to-build-a-next-js-pwa-in-2025-f334cd9755df)
- [PWA + React Server Components](https://medium.com/@mernstackdevbykevin/progressive-web-app-next-js-15-16-react-server-components-is-it-still-relevant-in-2025-4dff01d32a5d)
- [@ducanh2912/next-pwa](https://levelup.gitconnected.com/how-to-build-a-pwa-with-next-js-14-and-ducanh2912-next-pwa-c7fcb7a7b0ba)

### OCR and Vision
- [n8n OCR.space Integration](https://n8n.io/integrations/ocrspace/)
- [OpenRouter Multimodal Documentation](https://openrouter.ai/docs/guides/overview/multimodal/overview)
- [Free LLM Image-to-Text with OpenRouter](https://github.com/ceodaniyal/free-llm-image-to-text)
- [Mistral OCR in n8n](https://n8n.io/workflows/3102-parse-and-extract-data-from-documentsimages-with-mistral-ocr/)

### Recipe Scraping
- [Google Recipe Structured Data](https://developers.google.com/search/docs/appearance/structured-data/recipe)
- [Schema.org Recipe Type](https://schema.org/Recipe)
- [Scraping Recipes with JSON-LD](https://www.raymondcamden.com/2024/06/12/scraping-recipes-using-nodejs-pipedream-and-json-ld)

### Caching Strategies
- [PWA Caching MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- [PWA API Cache Strategy](https://pwa-workshop.js.org/4-api-cache/)
- [Service Worker Caching Strategies](https://web.dev/learn/pwa/caching)

### Next.js Architecture
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [BFF Architecture with Next.js](https://vishal-vishal-gupta48.medium.com/building-a-secure-scalable-bff-backend-for-frontend-architecture-with-next-js-api-routes-cbc8c101bff0)
