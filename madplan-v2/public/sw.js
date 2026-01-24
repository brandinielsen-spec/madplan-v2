// Service Worker for Madplan PWA
// Network-first caching for API routes, cache-first for static assets

const CACHE_NAME = 'madplan-v1'
const STATIC_ASSETS = [
  '/',
  '/ugeplan',
  '/opskrifter',
  '/indkob',
  '/tilfoej',
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

// Fetch: network-first for API and documents, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests
  if (request.method !== 'GET') return

  // Network-first for API routes
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Network-first for document requests
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request))
    return
  }

  // Cache-first for other assets (images, scripts, styles)
  event.respondWith(cacheFirst(request))
})

// Network-first strategy: try network, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    // Only cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // No cache available, return offline error
    return new Response(
      JSON.stringify({ error: 'offline', message: 'Du er offline' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Cache-first strategy: try cache, fall back to network
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

// Listen for prefetch messages from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREFETCH_WEEK') {
    const { url } = event.data
    fetch(url)
      .then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(url, response)
          })
        }
      })
      .catch(() => {
        // Prefetch failed, ignore silently
      })
  }
})
