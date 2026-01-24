import useSWR from 'swr'
import type { Ejer } from '@/lib/types'

export function useEjere() {
  const { data, error, isLoading } = useSWR<Ejer[]>(
    '/api/madplan/ejere'
  )

  return {
    ejere: data ?? [],
    isLoading,
    isError: !!error,
    error,
  }
}
