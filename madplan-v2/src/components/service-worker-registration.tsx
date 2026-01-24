'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/sw-register'

/**
 * Service Worker Registration Component
 * Client component wrapper to register service worker on mount
 * Renders nothing - only side effect
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}
