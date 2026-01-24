'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribe to online/offline events
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/**
 * Get current online status
 */
function getSnapshot(): boolean {
  return navigator.onLine
}

/**
 * Server-side snapshot (assume online during SSR)
 */
function getServerSnapshot(): boolean {
  return true
}

/**
 * Hook for tracking online/offline status
 * Uses useSyncExternalStore for proper React 18+ subscription
 *
 * @returns boolean - true if online, false if offline
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
