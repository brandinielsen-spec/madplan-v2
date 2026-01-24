'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

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
