# Phase 3: PWA Enhancement - Research

**Researched:** 2026-01-24
**Domain:** Swipe Gestures, Service Workers, Offline Caching
**Confidence:** HIGH

## Summary

This phase transforms the Madplan app into a native-feeling PWA with swipe-based week navigation and offline caching. The research covers three key areas: gesture libraries for smooth swipe navigation, service worker setup for Next.js 15, and SWR cache persistence for offline data access.

The recommended approach uses **Embla Carousel** for swipe gestures (already integrated via shadcn/ui), a **manual service worker** with network-first caching for API data, and **localStorage-based SWR cache persistence** for offline fallback. This stack aligns with the existing codebase and provides native iOS-like swipe feel without heavy dependencies.

**Primary recommendation:** Use Embla Carousel's swipe mechanics for week navigation, implement a custom service worker with network-first caching for API routes, and persist SWR cache to localStorage for offline read-only access.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| embla-carousel-react | 8.6.0 | Swipe gesture handling | Already used by shadcn/ui Carousel, lightweight (4KB), native swipe precision |
| SWR | 2.3.8 (installed) | Data fetching with cache | Already in use, supports cache providers for persistence |
| Navigator Service Worker API | Native | Offline caching | Browser native, no dependencies needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 12.x | Animation/transitions | Only if Embla insufficient for transition animations |
| workbox-window | 7.x | Service worker messaging | Only if need precaching with complex strategies |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Embla Carousel | Framer Motion drag | More control but requires manual snap logic, larger bundle |
| Manual SW | Serwist/next-pwa | More features but webpack dependency conflicts with Turbopack |
| localStorage cache | IndexedDB | Better for large data but overkill for meal plan data |

**Installation:**
```bash
npm install embla-carousel-react
# Note: framer-motion NOT needed - Embla provides sufficient swipe handling
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── ugeplan/
│       └── page.tsx           # Week swipe container
├── components/
│   └── ugeplan/
│       ├── week-swiper.tsx    # Embla carousel wrapper for weeks
│       ├── week-slide.tsx     # Individual week content
│       └── week-nav.tsx       # Enhanced with swipe sync
├── hooks/
│   ├── use-swipe-week.ts      # Week navigation via swipe
│   └── use-online-status.ts   # Offline detection
├── providers/
│   └── swr-provider.tsx       # Enhanced with localStorage cache
├── lib/
│   └── sw-register.ts         # Service worker registration
└── public/
    └── sw.js                  # Service worker file
```

### Pattern 1: Embla Carousel Week Swiper
**What:** Use Embla Carousel to create swipeable week slides
**When to use:** When implementing the full-page week swipe navigation
**Example:**
```typescript
// Source: https://www.embla-carousel.com/get-started/react/
'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

interface WeekSwiperProps {
  currentWeek: { aar: number; uge: number }
  onWeekChange: (week: { aar: number; uge: number }) => void
  children: React.ReactNode[]  // Week slides
}

export function WeekSwiper({ currentWeek, onWeekChange, children }: WeekSwiperProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,           // Hard stop at boundaries per CONTEXT.md
    dragFree: false,       // Snap to weeks, not momentum scroll
    containScroll: 'keepSnaps',
    startIndex: 4,         // Center index (current week)
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())

    const index = emblaApi.selectedScrollSnap()
    // Convert index to week offset from center (index 4 = current week)
    const weekOffset = index - 4
    // Calculate actual week from offset
    onWeekChange(calculateWeekFromOffset(currentWeek, weekOffset))
  }, [emblaApi, currentWeek, onWeekChange])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return (
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex touch-pan-y">
        {children}
      </div>
    </div>
  )
}
```

### Pattern 2: Service Worker Registration
**What:** Register service worker from client component
**When to use:** App initialization for offline support
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/progressive-web-apps
// src/lib/sw-register.ts
'use client'

export function registerServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      console.log('SW registered:', registration.scope)
    } catch (error) {
      console.error('SW registration failed:', error)
    }
  })
}
```

### Pattern 3: Network-First API Caching
**What:** Service worker caches API responses, serves cached on network failure
**When to use:** For API routes that should work offline
**Example:**
```javascript
// Source: https://web.dev/learn/pwa/workbox
// public/sw.js
const CACHE_NAME = 'madplan-api-v1'
const API_ROUTES = ['/api/madplan/uge', '/api/madplan/opskrifter']

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only cache GET requests to API routes
  if (request.method !== 'GET') return
  if (!API_ROUTES.some(route => url.pathname.startsWith(route))) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone response before caching (response can only be read once)
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone)
        })
        return response
      })
      .catch(async () => {
        // Network failed, try cache
        const cachedResponse = await caches.match(request)
        if (cachedResponse) return cachedResponse
        // Return offline error response
        return new Response(JSON.stringify({ offline: true }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      })
  )
})
```

### Pattern 4: SWR localStorage Persistence
**What:** Persist SWR cache to localStorage for offline fallback
**When to use:** In SWRConfig provider for app-wide cache persistence
**Example:**
```typescript
// Source: https://swr.vercel.app/docs/advanced/cache
// src/providers/swr-provider.tsx
'use client'

import { SWRConfig } from 'swr'

function localStorageProvider() {
  if (typeof window === 'undefined') {
    return new Map()
  }

  // Restore cache from localStorage on init
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem('madplan-cache') || '[]')
  )

  // Save cache to localStorage before page unload
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('madplan-cache', appCache)
  })

  return map
}

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

### Pattern 5: Online Status Hook
**What:** Track online/offline status reactively
**When to use:** Show offline banner, disable mutations
**Example:**
```typescript
// Source: https://peerlist.io/himanshuhere/articles/detecting-online-offline-status-in-react-with-typescript
// src/hooks/use-online-status.ts
'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

function getServerSnapshot() {
  return true  // Assume online during SSR
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
```

### Anti-Patterns to Avoid
- **Hand-rolling swipe detection:** Use Embla's battle-tested touch handling, not custom pointer events
- **Caching POST requests:** Service workers can't cache POST; use optimistic UI instead
- **Blocking mutations when offline:** Show clear feedback, don't silently fail
- **Using next-pwa with Turbopack:** Webpack conflicts; use manual service worker instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe detection | Custom touch event handlers | Embla Carousel | Cross-browser quirks, velocity calculation, momentum |
| Swipe threshold logic | Distance/velocity math | Embla's snap behavior | Already handles partial swipe snap-back |
| Service worker lifecycle | Manual install/activate | Browser native + registration helper | Complex update flows, scope issues |
| Cache invalidation | Manual cache clearing | Network-first strategy | Stale data served is worse than no data |
| Offline detection | Polling navigator.onLine | useSyncExternalStore pattern | Race conditions, memory leaks with events |

**Key insight:** Swipe gestures require handling dozens of edge cases (multi-touch, scroll vs swipe, velocity thresholds, momentum, snap-back). Embla handles all of these; custom implementations invariably miss edge cases.

## Common Pitfalls

### Pitfall 1: Swipe Conflicting with Browser Back Gesture
**What goes wrong:** iOS Safari edge swipe navigates back instead of changing week
**Why it happens:** Browser interprets edge swipes as navigation gestures
**How to avoid:**
- Apply `touch-action: pan-y` on swipe container (allows vertical scroll, blocks horizontal browser gestures)
- Use `overscroll-behavior-x: contain` to prevent gesture propagation
- Keep swipeable area slightly inset from screen edges
**Warning signs:** Users report "going back" when swiping on iOS

### Pitfall 2: Service Worker Caching Stale Data Forever
**What goes wrong:** Old API responses served even when online
**Why it happens:** Cache-first strategy without expiration
**How to avoid:** Use network-first strategy for API routes; cache-first only for static assets
**Warning signs:** Data doesn't update after changes in backend

### Pitfall 3: Swipe Interfering with Vertical Scroll
**What goes wrong:** Trying to scroll day cards triggers week change
**Why it happens:** No angle detection; any horizontal movement triggers swipe
**How to avoid:**
- Embla's default touch handling has built-in angle detection
- Use `touch-action: pan-y pinch-zoom` on container
- Let Embla's dragThreshold filter out small horizontal movements
**Warning signs:** Vertical scroll feels "sticky" or triggers horizontal movement

### Pitfall 4: localStorage Cache Growing Unbounded
**What goes wrong:** Cache fills up over months of use
**Why it happens:** No expiration, every week's data persists
**How to avoid:**
- Only cache recent weeks (current +/- 4 weeks)
- Clear old entries on app load
- Use timestamp-based cache keys for easy pruning
**Warning signs:** localStorage quota errors, slow app startup

### Pitfall 5: Offline Banner Flashing on Slow Networks
**What goes wrong:** Banner appears/disappears rapidly on unstable connections
**Why it happens:** navigator.onLine fires on every network change
**How to avoid:** Debounce offline status changes (e.g., 2 second delay before showing banner)
**Warning signs:** Banner flickering, user confusion about actual status

### Pitfall 6: Service Worker Not Updating
**What goes wrong:** Old service worker serves outdated cached assets
**Why it happens:** Browser caches sw.js, skipWaiting not called
**How to avoid:**
- Set `Cache-Control: no-cache` header on sw.js
- Increment cache version on changes
- Call `skipWaiting()` in install event
**Warning signs:** Changes not appearing after deployment

## Code Examples

Verified patterns from official sources:

### Embla Carousel with Button Navigation Sync
```typescript
// Source: https://www.embla-carousel.com/guides/previous-and-next-buttons/
'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

export function useSwipeWeek() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    startIndex: 4,  // Current week at center
  })

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(4)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return {
    emblaRef,
    emblaApi,
    scrollPrev,
    scrollNext,
    canPrev,
    canNext,
    selectedIndex,
  }
}
```

### Offline Banner Component
```typescript
// Source: https://reacthustle.com/blog/react-check-online-status-tutorial
'use client'

import { useOnlineStatus } from '@/hooks/use-online-status'
import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const [showBanner, setShowBanner] = useState(false)

  // Debounce offline status to prevent flashing
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
    setShowBanner(false)
  }, [isOnline])

  if (!showBanner) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-100 text-amber-800 text-center py-2 text-sm z-50">
      Du er offline
    </div>
  )
}
```

### Service Worker with Prefetching
```javascript
// Source: https://web.dev/imperative-caching-guide/
// public/sw.js

const CACHE_NAME = 'madplan-v1'
const STATIC_ASSETS = [
  '/',
  '/ugeplan',
  '/opskrifter',
  '/indkob',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api/')) {
    // Network-first for API
    event.respondWith(networkFirst(request))
  } else if (request.destination === 'document') {
    // Network-first for pages
    event.respondWith(networkFirst(request))
  } else {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request))
  }
})

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch {
    return caches.match(request)
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch {
    return new Response('Offline', { status: 503 })
  }
}

// Listen for prefetch messages from app
self.addEventListener('message', (event) => {
  if (event.data.type === 'PREFETCH_WEEK') {
    const { url } = event.data
    fetch(url).then((response) => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(url, response)
      })
    })
  }
})
```

### Prefetch Adjacent Weeks
```typescript
// Source: https://web.dev/imperative-caching-guide/
// src/hooks/use-prefetch-weeks.ts
'use client'

import { useEffect } from 'react'
import { navigateWeek } from '@/lib/week-utils'

export function usePrefetchWeeks(
  ejerId: string | null,
  currentWeek: { aar: number; uge: number }
) {
  useEffect(() => {
    if (!ejerId) return
    if (!('serviceWorker' in navigator)) return

    const prefetch = async () => {
      const registration = await navigator.serviceWorker.ready

      // Prefetch next week
      const nextWeek = navigateWeek(currentWeek.aar, currentWeek.uge, 'next')
      registration.active?.postMessage({
        type: 'PREFETCH_WEEK',
        url: `/api/madplan/uge?ejerId=${ejerId}&aar=${nextWeek.aar}&uge=${nextWeek.uge}`,
      })
    }

    prefetch()
  }, [ejerId, currentWeek.aar, currentWeek.uge])
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-pwa package | Manual SW or Serwist | 2024 | next-pwa unmaintained, conflicts with Turbopack |
| Framer Motion for all gestures | Embla for carousels, FM for animations | 2023 | Embla more performant for swipe carousels |
| Service worker cache-first | Network-first for dynamic data | Always | Stale data worse than loading state |
| navigator.onLine polling | useSyncExternalStore | React 18 | Cleaner, no manual cleanup |

**Deprecated/outdated:**
- `next-pwa`: Unmaintained, webpack-only, conflicts with Next.js 15 Turbopack
- `react-swipeable`: Less precise than Embla for carousel-style navigation
- `workbox-webpack-plugin`: Requires webpack config, complex for simple use cases

## Open Questions

Things that couldn't be fully resolved:

1. **iOS Safari edge swipe behavior in standalone mode**
   - What we know: PWA standalone mode may have different gesture handling than Safari
   - What's unclear: Whether touch-action fully prevents back gesture in standalone
   - Recommendation: Test on physical iOS device in both Safari and installed PWA

2. **SWR cache size limits**
   - What we know: localStorage has ~5MB limit per origin
   - What's unclear: How many weeks of data fit before hitting limits
   - Recommendation: Implement cache pruning early, keep only 9 weeks (current +/- 4)

3. **Service worker update flow in production**
   - What we know: skipWaiting causes immediate activation
   - What's unclear: Impact on in-progress API requests during update
   - Recommendation: Version cache names, test update flow before deploy

## Sources

### Primary (HIGH confidence)
- [Embla Carousel React Setup](https://www.embla-carousel.com/get-started/react/) - Core hook usage, options
- [Embla Carousel Options](https://www.embla-carousel.com/api/options/) - All configuration options
- [Embla Carousel Methods](https://www.embla-carousel.com/api/methods/) - API methods for navigation
- [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/carousel) - Integration with shadcn components
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) - Official service worker setup
- [SWR Cache Documentation](https://swr.vercel.app/docs/advanced/cache) - Cache provider pattern

### Secondary (MEDIUM confidence)
- [MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) - CSS for gesture control
- [Workbox Caching Strategies](https://web.dev/learn/pwa/workbox) - Network-first vs cache-first patterns
- [React Online Status Tutorial](https://peerlist.io/himanshuhere/articles/detecting-online-offline-status-in-react-with-typescript) - useSyncExternalStore pattern

### Tertiary (LOW confidence)
- [Framer Motion Snap Points](https://sinja.io/blog/framer-motion-drag-snap-points) - Alternative if Embla insufficient
- [SWR localStorage Persistence Discussion](https://github.com/vercel/swr/discussions/592) - Community patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs verified, shadcn/ui already uses Embla
- Architecture: HIGH - Patterns from official Next.js and Embla docs
- Pitfalls: MEDIUM - Based on community discussions and MDN docs

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable APIs)
