import useSWR from 'swr'
import type { Opskrift } from '@/lib/types'

export function useOpskrifter(ejerId: string | null) {
  const cacheKey = ejerId ? `/api/madplan/opskrifter?ejerId=${ejerId}` : null
  const { data, error, isLoading, mutate } = useSWR<Opskrift[]>(cacheKey)

  const toggleFavorite = async (opskriftId: string) => {
    if (!cacheKey || !data) return

    const currentRecipe = data.find((o) => o.id === opskriftId)
    if (!currentRecipe) return

    const newFavorit = !(currentRecipe.favorit ?? false)

    // Optimistic update
    mutate(
      data.map((o) =>
        o.id === opskriftId ? { ...o, favorit: newFavorit } : o
      ),
      {
        revalidate: false,
        rollbackOnError: true,
      }
    )

    // Server sync
    try {
      const response = await fetch('/api/madplan/opskrift/favorit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opskriftId, favorit: newFavorit }),
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
    } catch (error) {
      // SWR will rollback on error
      console.error('Toggle favorite error:', error)
      throw error
    }
  }

  return {
    opskrifter: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    toggleFavorite,
  }
}
