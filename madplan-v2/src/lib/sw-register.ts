/**
 * Service Worker Registration Utility
 * Registers the service worker for offline support
 */

export function registerServiceWorker(): void {
  // Guard: only run in browser
  if (typeof window === 'undefined') return

  // Guard: check for service worker support
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported')
    return
  }

  // Register on window load to not block initial render
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Ensure updates are detected
      })
      console.log('Service Worker registered:', registration.scope)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  })
}
