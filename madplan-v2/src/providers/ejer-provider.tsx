'use client'

import { type ReactNode } from 'react'
import { EjerProvider } from '@/contexts/ejer-context'
import { useEjere } from '@/hooks/use-ejere'

interface EjerProviderWrapperProps {
  children: ReactNode
}

/**
 * Wrapper that fetches ejere and provides them to EjerProvider.
 * Must be used inside SWRProvider since useEjere uses SWR.
 */
export function EjerProviderWrapper({ children }: EjerProviderWrapperProps) {
  const { ejere, isLoading } = useEjere()

  return (
    <EjerProvider ejere={ejere} isLoading={isLoading}>
      {children}
    </EjerProvider>
  )
}
