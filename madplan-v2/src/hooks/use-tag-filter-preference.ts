'use client'

import { useState, useEffect, useCallback } from 'react'

type TagState = 'include' | 'exclude'
type TagStates = Record<string, TagState>

const STORAGE_KEY = 'madplan-tag-filter-states'

export function useTagFilterPreference(): [
  TagStates,
  (tag: string) => void,
  () => void
] {
  const [tagStates, setTagStates] = useState<TagStates>({})
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate the parsed data
        if (typeof parsed === 'object' && parsed !== null) {
          const validStates: TagStates = {}
          for (const [tag, state] of Object.entries(parsed)) {
            if (state === 'include' || state === 'exclude') {
              validStates[tag] = state
            }
          }
          setTagStates(validStates)
        }
      }
    } catch {
      // Invalid JSON, ignore
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage when tagStates changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        if (Object.keys(tagStates).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tagStates))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        // localStorage not available, ignore
      }
    }
  }, [tagStates, isHydrated])

  // Cycle: none → include → exclude → none
  const handleTagToggle = useCallback((tag: string) => {
    setTagStates((prev) => {
      const current = prev[tag]
      if (!current) {
        // none → include
        return { ...prev, [tag]: 'include' }
      } else if (current === 'include') {
        // include → exclude
        return { ...prev, [tag]: 'exclude' }
      } else {
        // exclude → none (remove from state)
        const { [tag]: _, ...rest } = prev
        return rest
      }
    })
  }, [])

  // Clear all filters
  const clearTagStates = useCallback(() => {
    setTagStates({})
  }, [])

  return [tagStates, handleTagToggle, clearTagStates]
}
