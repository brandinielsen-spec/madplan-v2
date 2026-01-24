# Phase 2: Core Data Flow - Research

**Researched:** 2026-01-24
**Domain:** Next.js API Routes + SWR Data Fetching + Client-Side State
**Confidence:** HIGH

## Summary

Phase 2 requires building the data layer between the new Next.js v2 UI and existing n8n workflows. The architecture pattern is clear: Next.js API Routes act as a proxy/BFF (Backend for Frontend) to the n8n webhooks, while SWR handles client-side data fetching with optimistic updates for real-time UI responsiveness.

The v1 codebase already has a working API client (`src/lib/api.ts`) and TypeScript types (`src/lib/types.ts`) that can be adapted. The key changes are:
1. Move direct n8n calls behind Next.js API routes (security, CORS, future flexibility)
2. Replace raw `useState`/`useEffect` with SWR hooks for caching and revalidation
3. Add optimistic updates for checkbox interactions (shopping list)
4. Implement proper loading/error states with shadcn/ui components

**Primary recommendation:** Use SWR over TanStack Query due to simpler API, smaller bundle size (5.3KB vs 16.2KB), and the fact that this app has relatively simple data fetching needs. SWR's `useSWRMutation` provides sufficient optimistic update support.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SWR | ^2.2 | Client-side data fetching, caching, revalidation | Built by Vercel, optimal Next.js integration, smaller bundle |
| date-fns | ^3.0 or ^4.0 | ISO week handling (getISOWeek, startOfISOWeek) | Already used in v1, de-facto standard for date manipulation |
| Next.js Route Handlers | (built-in) | API proxy to n8n webhooks | Native, no extra dependency, Web API standards |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| use-long-press | ^3.0 | Long press gesture for mobile | Quick add modal trigger (decision: long-press for full selector) |
| sonner | (via shadcn) | Toast notifications | Error feedback, success confirmations |

### Already Installed (Phase 1)
| Library | Purpose |
|---------|---------|
| shadcn/ui (Card, Button, Skeleton, Sheet, Tabs, Badge) | UI components |
| lucide-react | Icons |
| Tailwind CSS v4 | Styling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SWR | TanStack Query | TanStack has more features (DevTools, infinite queries), but 3x larger bundle. SWR sufficient for this app's needs. |
| Next.js Route Handlers | Direct n8n calls from client | Exposes webhook URLs, no future flexibility, CORS issues |
| date-fns | dayjs | dayjs smaller but date-fns already in v1, tree-shakeable |

**Installation:**
```bash
npm install swr date-fns use-long-press
npx shadcn@latest add sonner checkbox input scroll-area toggle-group drawer command
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── api/                    # API Route Handlers (proxy to n8n)
│   │   └── madplan/
│   │       ├── ejere/
│   │       │   └── route.ts    # GET /api/madplan/ejere
│   │       ├── uge/
│   │       │   └── route.ts    # GET /api/madplan/uge?ejerId=&aar=&uge=
│   │       ├── dag/
│   │       │   └── route.ts    # POST /api/madplan/dag (opdater/slet)
│   │       ├── opskrifter/
│   │       │   └── route.ts    # GET /api/madplan/opskrifter?ejerId=
│   │       ├── opskrift/
│   │       │   └── route.ts    # GET/POST/PUT/DELETE
│   │       └── indkob/
│   │           └── route.ts    # GET/POST/PUT/DELETE
│   ├── ugeplan/
│   │   └── page.tsx            # Week plan view (client component)
│   ├── opskrifter/
│   │   ├── page.tsx            # Recipe list (client component)
│   │   └── [id]/
│   │       └── page.tsx        # Recipe detail
│   ├── indkob/
│   │   └── page.tsx            # Shopping list (client component)
│   └── layout.tsx              # Root layout with SWRConfig provider
├── components/
│   ├── layout/                 # AppShell, Header, MobileNav (existing)
│   ├── ugeplan/                # Week plan components
│   │   ├── day-card.tsx
│   │   ├── week-nav.tsx
│   │   └── recipe-picker.tsx
│   ├── opskrifter/             # Recipe components
│   │   ├── recipe-card.tsx
│   │   └── recipe-list-item.tsx
│   └── indkob/                 # Shopping list components
│       ├── shopping-item.tsx
│       └── category-group.tsx
├── hooks/                      # Custom hooks
│   ├── use-ugeplan.ts          # SWR hook for week plan
│   ├── use-opskrifter.ts       # SWR hook for recipes
│   ├── use-indkobsliste.ts     # SWR hook for shopping list
│   └── use-long-press.ts       # Long press gesture (or use library)
├── lib/
│   ├── api.ts                  # Fetch wrapper for internal API routes
│   ├── types.ts                # TypeScript interfaces (from v1)
│   └── utils.ts                # Date utilities (from v1)
└── providers/
    └── swr-provider.tsx        # SWRConfig wrapper (client component)
```

### Pattern 1: API Route as Proxy
**What:** Route Handlers forward requests to n8n webhooks
**When to use:** All data operations that need backend
**Example:**
```typescript
// src/app/api/madplan/uge/route.ts
import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL // Server-only, not NEXT_PUBLIC_

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ejerId = searchParams.get('ejerId')
  const aar = searchParams.get('aar')
  const uge = searchParams.get('uge')

  if (!ejerId || !aar || !uge) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/uge?ejerId=${ejerId}&aar=${aar}&uge=${uge}`,
      { cache: 'no-store' } // Dynamic data, no caching at proxy level
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data.data ?? data)
  } catch (error) {
    console.error('n8n proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Pattern 2: SWR Data Fetching with Custom Hooks
**What:** Encapsulate SWR logic in reusable hooks
**When to use:** Any component that needs server data
**Example:**
```typescript
// src/hooks/use-ugeplan.ts
import useSWR from 'swr'
import { Ugeplan } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useUgeplan(ejerId: string | null, aar: number, uge: number) {
  const { data, error, isLoading, mutate } = useSWR<Ugeplan>(
    ejerId ? `/api/madplan/uge?ejerId=${ejerId}&aar=${aar}&uge=${uge}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when tab gains focus
      dedupingInterval: 5000,   // Dedupe requests within 5s
    }
  )

  return {
    ugeplan: data,
    isLoading,
    isError: error,
    mutate,
  }
}
```

### Pattern 3: Optimistic Updates for Checkbox
**What:** Immediately update UI, revert on error
**When to use:** Shopping list checkbox, any toggle interaction
**Example:**
```typescript
// src/hooks/use-indkobsliste.ts
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Indkoebspost } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

async function updatePost(url: string, { arg }: { arg: { id: string; afkrydset: boolean } }) {
  const res = await fetch('/api/madplan/indkob', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export function useIndkobsliste(ejerId: string | null, aar: number, uge: number) {
  const key = ejerId ? `/api/madplan/indkob?ejerId=${ejerId}&aar=${aar}&uge=${uge}` : null

  const { data, error, isLoading, mutate } = useSWR<Indkoebspost[]>(key, fetcher)

  const { trigger: toggleItem } = useSWRMutation(key, updatePost, {
    optimisticData: (current: Indkoebspost[], { arg }) =>
      current.map(item =>
        item.id === arg.id ? { ...item, afkrydset: arg.afkrydset } : item
      ),
    rollbackOnError: true,
    revalidate: false, // Don't revalidate, we already updated optimistically
  })

  return {
    items: data ?? [],
    isLoading,
    isError: error,
    toggleItem,
    mutate,
  }
}
```

### Pattern 4: SWRConfig Provider Setup
**What:** Global SWR configuration in App Router
**When to use:** Root layout for consistent defaults
**Example:**
```typescript
// src/providers/swr-provider.tsx
'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(res => {
          if (!res.ok) throw new Error('Fetch failed')
          return res.json()
        }),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}

// src/app/layout.tsx
import { SWRProvider } from '@/providers/swr-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
```

### Anti-Patterns to Avoid
- **Direct n8n calls from client:** Exposes webhook URLs, no error handling layer, CORS issues
- **useState + useEffect for data:** No caching, no deduplication, manual loading/error state management
- **Fetching in Server Components for this app:** Phase 2 views need interactivity (week nav, checkboxes), so Client Components with SWR are appropriate
- **Over-caching dynamic data:** Week plan and shopping list should always show current data

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ISO week calculation | Manual week math | date-fns getISOWeek, startOfISOWeek | Edge cases around year boundaries (Week 1 of 2025 starts Dec 30, 2024) |
| Client-side caching | useState with manual caching | SWR | Deduplication, revalidation, error retry, optimistic updates |
| Toast notifications | Custom toast component | shadcn/ui Sonner | Accessible, animated, queued, promise support |
| Long press detection | onTouchStart + setTimeout | use-long-press or @uidotdev/usehooks | Handles both mouse and touch, proper cleanup, threshold config |
| Mobile bottom sheet | Custom modal positioning | shadcn/ui Drawer (Vaul) | Native-feeling swipe-to-dismiss, proper backdrop |

**Key insight:** Date handling and gesture detection are deceptively complex. ISO week years can differ from calendar years around New Year. Mobile touch events have edge cases (scroll interference, multi-touch). Use battle-tested libraries.

## Common Pitfalls

### Pitfall 1: NEXT_PUBLIC_ vs Server Environment Variables
**What goes wrong:** n8n webhook URL exposed to client bundle
**Why it happens:** Using NEXT_PUBLIC_N8N_URL instead of server-only N8N_WEBHOOK_URL
**How to avoid:**
- API Routes (server-side): Use `process.env.N8N_WEBHOOK_URL` (no NEXT_PUBLIC_ prefix)
- Client components: Only call `/api/madplan/*` routes, never direct n8n URLs
**Warning signs:** n8n URL visible in browser Network tab or page source

### Pitfall 2: Request Body Already Consumed
**What goes wrong:** POST proxy returns empty body to client
**Why it happens:** Reading request body twice (once in middleware/logging, once in handler)
**How to avoid:** Read body once with `await request.json()` and store in variable
**Warning signs:** "body already read" errors, empty responses from proxy

### Pitfall 3: SWR Key Changes Causing Refetches
**What goes wrong:** Data fetches twice or flickers when navigating weeks
**Why it happens:** SWR key includes changing parameters, triggering new fetches
**How to avoid:** Use `keepPreviousData: true` in SWR config for smooth transitions
**Warning signs:** Loading state showing briefly when navigating between weeks

### Pitfall 4: ISO Week Year Boundary Issues
**What goes wrong:** December 31 shows as "Week 1" instead of expected week
**Why it happens:** ISO week numbering: last days of December may belong to Week 1 of next year
**How to avoid:** Always use date-fns getISOWeek + getISOWeekYear together; display both correctly
**Warning signs:** Week numbers don't match calendar expectations around New Year

### Pitfall 5: Optimistic Update Data Shape Mismatch
**What goes wrong:** Checkbox toggle causes list to disappear momentarily
**Why it happens:** optimisticData function returns wrong shape or undefined
**How to avoid:** Ensure optimisticData function always returns same shape as current data
**Warning signs:** UI flickers to empty state on toggle, then shows data again

### Pitfall 6: Client Components Forgetting 'use client'
**What goes wrong:** "useState is not a function" or "useEffect is not defined"
**Why it happens:** App Router defaults to Server Components; hooks require Client Components
**How to avoid:** Add 'use client' directive at top of files using React hooks or SWR
**Warning signs:** Cryptic "not a function" errors for React hooks

## Code Examples

Verified patterns from official sources:

### Next.js Route Handler - POST Proxy
```typescript
// Source: Next.js docs - Route Handlers
// src/app/api/madplan/dag/route.ts
import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const endpoint = action === 'slet' ? '/madplan/dag/slet' : '/madplan/dag/opdater'

    const response = await fetch(`${N8N_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Upstream error', details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('POST /api/madplan/dag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Shopping Item with Optimistic Checkbox
```typescript
// Source: SWR docs - Mutation & Optimistic UI
// src/components/indkob/shopping-item.tsx
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Indkoebspost } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ShoppingItemProps {
  item: Indkoebspost
  onToggle: (id: string, checked: boolean) => void
}

export function ShoppingItem({ item, onToggle }: ShoppingItemProps) {
  return (
    <div
      className="flex items-center gap-3 py-2"
      onClick={() => onToggle(item.id, !item.afkrydset)}
    >
      <Checkbox
        checked={item.afkrydset}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
      />
      <span className={cn(
        'flex-1',
        item.afkrydset && 'line-through text-muted-foreground'
      )}>
        {item.navn}
      </span>
      {item.kilde === 'manuel' && (
        <span className="text-xs text-muted-foreground">manuel</span>
      )}
    </div>
  )
}
```

### Week Navigation with date-fns
```typescript
// Source: date-fns docs + v1 utils.ts
// src/lib/week-utils.ts
import { getISOWeek, getISOWeekYear, startOfISOWeek, addWeeks, subWeeks, format } from 'date-fns'
import { da } from 'date-fns/locale'

export function getCurrentWeek(): { aar: number; uge: number } {
  const now = new Date()
  return {
    aar: getISOWeekYear(now), // Use getISOWeekYear, not getYear!
    uge: getISOWeek(now),
  }
}

export function navigateWeek(
  aar: number,
  uge: number,
  direction: 'prev' | 'next'
): { aar: number; uge: number } {
  // Construct date from ISO week
  const date = getDateFromISOWeek(aar, uge)
  const newDate = direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1)

  return {
    aar: getISOWeekYear(newDate),
    uge: getISOWeek(newDate),
  }
}

export function getDateFromISOWeek(year: number, week: number): Date {
  // January 4th is always in week 1
  const jan4 = new Date(year, 0, 4)
  const startOfWeek1 = startOfISOWeek(jan4)
  return addWeeks(startOfWeek1, week - 1)
}

export function getWeekDates(aar: number, uge: number): Date[] {
  const weekStart = getDateFromISOWeek(aar, uge)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })
}

export function formatDayDate(date: Date): string {
  return format(date, 'd. MMM', { locale: da })
}
```

### Drawer for Recipe Picker (Mobile-friendly)
```typescript
// Source: shadcn/ui Drawer docs
// src/components/ugeplan/recipe-picker.tsx
'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Opskrift } from '@/lib/types'

interface RecipePickerProps {
  opskrifter: Opskrift[]
  tidligereRetter: string[]
  onSelect: (ret: string, opskriftId?: string) => void
  trigger: React.ReactNode
}

export function RecipePicker({ opskrifter, tidligereRetter, onSelect, trigger }: RecipePickerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Vaelg ret</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] px-4">
          {tidligereRetter.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Senest brugte
              </h3>
              {tidligereRetter.slice(0, 5).map((ret) => (
                <DrawerClose key={ret} asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onSelect(ret)}
                  >
                    {ret}
                  </Button>
                </DrawerClose>
              ))}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Alle opskrifter
            </h3>
            {opskrifter.map((opskrift) => (
              <DrawerClose key={opskrift.id} asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelect(opskrift.titel, opskrift.id)}
                >
                  {opskrift.titel}
                </Button>
              </DrawerClose>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| getServerSideProps/getStaticProps | App Router route segment config + fetch caching | Next.js 13+ | Data fetching in components, not pages |
| NEXT_PUBLIC_ for all API URLs | Server-only env + API routes as proxy | Best practice | Better security, URL not in client bundle |
| useState + useEffect for data | SWR/TanStack Query hooks | 2020+ | Caching, deduplication, revalidation built-in |
| Custom toast implementations | Sonner via shadcn/ui | 2023+ | Accessible, animated, promise-aware |
| Manual optimistic updates | useSWRMutation with optimisticData | SWR 2.0 (2023) | Declarative, automatic rollback |

**Deprecated/outdated:**
- Direct n8n calls from client (v1 pattern): Replaced by API route proxy for security
- getYear() for ISO week operations: Use getISOWeekYear() to handle year boundaries correctly

## Open Questions

Things that couldn't be fully resolved:

1. **Owner (Ejer) Selection Persistence**
   - What we know: v1 uses URL params + localStorage
   - What's unclear: Should v2 persist in localStorage, URL params, or both?
   - Recommendation: Use URL params for shareable links, localStorage as fallback default

2. **Thumbnail Images for Week Plan**
   - What we know: Decision says "if fast to load", Airtable schema doesn't show image field
   - What's unclear: Where do recipe images come from? Are they stored?
   - Recommendation: Plan for optional image field, skip thumbnails in initial implementation

3. **Shopping List Category Grouping**
   - What we know: Decision says "grouped by category (Gront, Mejeri, Kod, etc.)"
   - What's unclear: Is category stored per item in Airtable, or derived from ingredient name?
   - Recommendation: Assume manual/derived for now, can add category field later

## Sources

### Primary (HIGH confidence)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) - API proxy patterns
- [Next.js Building APIs](https://nextjs.org/blog/building-apis-with-nextjs) - BFF pattern explanation
- [shadcn/ui Components](https://ui.shadcn.com/docs/components) - Checkbox, Card, Drawer, Sonner

### Secondary (MEDIUM confidence)
- [SWR Mutation Docs](https://swr.vercel.app/docs/mutation) - useSWRMutation, optimistic updates (via WebSearch)
- [SWR Global Configuration](https://swr.vercel.app/docs/global-configuration) - SWRConfig provider setup
- [date-fns ISO Week](https://github.com/orgs/date-fns/discussions/2168) - ISO week to date conversion

### Tertiary (LOW confidence)
- [TanStack Query vs SWR comparison](https://refine.dev/blog/react-query-vs-tanstack-query-vs-swr-2025/) - Bundle size, feature comparison
- [use-long-press npm](https://www.npmjs.com/package/use-long-press) - Long press gesture hook

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs, well-established patterns
- Architecture: HIGH - v1 working pattern + official Next.js docs
- Pitfalls: MEDIUM - Based on common issues from GitHub discussions, some from experience
- Code examples: HIGH - Adapted from official documentation

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stack is stable)
