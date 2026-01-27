import useSWR from 'swr'
import type { Ejer } from '@/lib/types'

export function useEjere() {
  const { data, error, isLoading, mutate } = useSWR<Ejer[]>(
    '/api/madplan/ejere'
  )

  const createEjer = async (navn: string): Promise<Ejer> => {
    const response = await fetch('/api/madplan/ejere', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ navn }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Kunne ikke oprette ejer')
    }

    const newEjer = await response.json()

    // Refresh the list
    await mutate()

    return newEjer
  }

  return {
    ejere: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    createEjer,
  }
}
