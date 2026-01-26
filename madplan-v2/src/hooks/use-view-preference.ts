'use client'

import { useState, useEffect, useCallback } from 'react'

type ViewMode = 'grid' | 'list'

/**
 * Custom hook for persisting view preference to localStorage.
 * SSR-safe: handles hydration correctly without mismatches.
 *
 * @param key - localStorage key to use
 * @param defaultValue - default view mode if no preference stored
 * @returns [viewMode, setViewMode] tuple
 */
export function useViewPreference(
  key: string,
  defaultValue: ViewMode = 'grid'
): [ViewMode, (value: ViewMode) => void] {
  // Initialize with default value (SSR-safe)
  const [view, setView] = useState<ViewMode>(defaultValue)

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored === 'grid' || stored === 'list') {
      setView(stored)
    }
  }, [key])

  const setViewAndPersist = useCallback((newView: ViewMode) => {
    setView(newView)
    localStorage.setItem(key, newView)
  }, [key])

  return [view, setViewAndPersist]
}
