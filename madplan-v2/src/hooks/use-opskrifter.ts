import useSWR from 'swr'
import type { Opskrift } from '@/lib/types'

export function useOpskrifter(ejerId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Opskrift[]>(
    ejerId ? `/api/madplan/opskrifter?ejerId=${ejerId}` : null
  )

  return {
    opskrifter: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
