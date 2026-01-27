'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Ejer } from '@/lib/types'

interface EjerContextValue {
  selectedEjerId: string | null
  selectedEjer: Ejer | null
  setSelectedEjerId: (id: string) => void
  isHydrated: boolean
}

const EjerContext = createContext<EjerContextValue | null>(null)

const STORAGE_KEY = 'madplan-selected-ejer'

interface EjerProviderProps {
  children: ReactNode
  ejere: Ejer[]
  isLoading: boolean
}

export function EjerProvider({ children, ejere, isLoading }: EjerProviderProps) {
  const [selectedEjerId, setSelectedEjerIdState] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSelectedEjerIdState(stored)
      }
    } catch (error) {
      console.warn('Failed to read ejer from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Validate selected ejer exists, fallback to first ejer if not
  useEffect(() => {
    if (!isHydrated || isLoading || ejere.length === 0) return

    const ejerExists = selectedEjerId && ejere.some((e) => e.id === selectedEjerId)

    if (!ejerExists) {
      // Fallback to first ejer
      const fallbackId = ejere[0].id
      setSelectedEjerIdState(fallbackId)
      try {
        localStorage.setItem(STORAGE_KEY, fallbackId)
      } catch (error) {
        console.warn('Failed to save ejer to localStorage:', error)
      }
    }
  }, [isHydrated, isLoading, ejere, selectedEjerId])

  const setSelectedEjerId = useCallback((id: string) => {
    setSelectedEjerIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch (error) {
      console.warn('Failed to save ejer to localStorage:', error)
    }
  }, [])

  const selectedEjer = ejere.find((e) => e.id === selectedEjerId) ?? null

  return (
    <EjerContext.Provider
      value={{
        selectedEjerId,
        selectedEjer,
        setSelectedEjerId,
        isHydrated,
      }}
    >
      {children}
    </EjerContext.Provider>
  )
}

export function useSelectedEjer() {
  const context = useContext(EjerContext)
  if (!context) {
    throw new Error('useSelectedEjer must be used within EjerProvider')
  }
  return context
}
