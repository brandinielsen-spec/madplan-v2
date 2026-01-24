'use client'

import { SWRConfig, Cache } from 'swr'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

const CACHE_KEY = 'madplan-cache'

/**
 * localStorage cache provider for SWR
 * Persists cache to localStorage for offline fallback
 */
function localStorageProvider(): Cache<unknown> {
  // SSR guard - return empty Map on server
  if (typeof window === 'undefined') {
    return new Map() as Cache<unknown>
  }

  // Restore cache from localStorage on init
  let cachedData: [string, unknown][] = []
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (stored) {
      cachedData = JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to restore SWR cache from localStorage:', error)
  }

  const map = new Map<string, unknown>(cachedData)

  // Save cache to localStorage before page unload
  window.addEventListener('beforeunload', () => {
    try {
      const appCache = JSON.stringify(Array.from(map.entries()))
      localStorage.setItem(CACHE_KEY, appCache)
    } catch (error) {
      console.warn('Failed to save SWR cache to localStorage:', error)
    }
  })

  return map as Cache<unknown>
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('Fetch failed')
    throw error
  }
  return res.json()
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 5000,
      }}
    >
      {children}
      <Toaster position="top-center" richColors />
    </SWRConfig>
  )
}
