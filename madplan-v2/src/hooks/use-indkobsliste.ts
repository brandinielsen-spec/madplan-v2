import { useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { Indkoebspost } from '@/lib/types'

interface AddItemArgs {
  ejerId: string
  aar: number
  uge: number
  navn: string
}

async function addItem(
  url: string,
  { arg }: { arg: AddItemArgs }
) {
  const res = await fetch('/api/madplan/indkob', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to add item')
  return res.json()
}

export function useIndkobsliste(ejerId: string | null, aar: number, uge: number) {
  const [isClearing, setIsClearing] = useState(false)
  const [isAddingMultiple, setIsAddingMultiple] = useState(false)

  const key = ejerId
    ? `/api/madplan/indkob?ejerId=${ejerId}&aar=${aar}&uge=${uge}`
    : null

  const { data, error, isLoading, mutate } = useSWR<Indkoebspost[]>(key)

  const { trigger: triggerAdd, isMutating: isAdding } = useSWRMutation(key, addItem, {
    revalidate: true,  // Refetch after add to get new item with ID
  })

  // Group items by category (kilde for now, can be enhanced later)
  // Move checked items to the bottom
  const sortedItems = [...(data ?? [])].sort((a, b) => {
    // Unchecked items first
    if (a.afkrydset !== b.afkrydset) {
      return a.afkrydset ? 1 : -1
    }
    // Then by kilde (ret before manuel)
    if (a.kilde !== b.kilde) {
      return a.kilde === 'ret' ? -1 : 1
    }
    // Then alphabetically
    return a.navn.localeCompare(b.navn, 'da')
  })

  // Optimistic toggle using mutate directly
  const handleToggleItem = async (id: string, afkrydset: boolean) => {
    // Optimistic update
    const optimisticData = (data ?? []).map((item) =>
      item.id === id ? { ...item, afkrydset } : item
    )

    try {
      await mutate(
        async () => {
          // Perform the actual API call
          const res = await fetch('/api/madplan/indkob', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, afkrydset }),
          })
          if (!res.ok) throw new Error('Failed to toggle item')
          // Return current data (optimistic is already applied)
          return optimisticData
        },
        {
          optimisticData,
          rollbackOnError: true,
          revalidate: false,
        }
      )
    } catch (error) {
      // Error is handled by rollbackOnError
      throw error
    }
  }

  // Add multiple items at once (for recipe ingredients)
  // Returns { added: number, failed: number } for accurate feedback
  const addItems = async (
    navne: string[],
    kildeNavn?: string
  ): Promise<{ added: number; failed: number }> => {
    if (!ejerId) throw new Error('No owner selected')

    setIsAddingMultiple(true)
    let added = 0
    let failed = 0

    try {
      // Add items sequentially with small delay to ensure reliable processing
      for (const navn of navne) {
        try {
          const res = await fetch('/api/madplan/indkob', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ejerId, aar, uge, navn, kildeNavn }),
          })
          if (res.ok) {
            added++
          } else {
            const errorText = await res.text().catch(() => 'Unknown error')
            console.error(`Failed to add item "${navn}": ${res.status} - ${errorText}`)
            failed++
          }
        } catch (error) {
          console.error(`Error adding item "${navn}":`, error)
          failed++
        }
        // Small delay between requests to ensure reliable processing
        if (navne.indexOf(navn) < navne.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      // Revalidate after all items added
      await mutate()
    } finally {
      setIsAddingMultiple(false)
    }

    return { added, failed }
  }

  return {
    items: sortedItems,
    isLoading,
    isError: !!error,
    error,
    mutate,

    // Convenience methods
    toggleItem: handleToggleItem,

    addItem: async (navn: string) => {
      if (!ejerId) throw new Error('No owner selected')
      return triggerAdd({ ejerId, aar, uge, navn })
    },

    addItems,

    clearAll: async () => {
      if (!ejerId) throw new Error('No owner selected')
      setIsClearing(true)
      try {
        // Optimistic update - clear the list immediately
        await mutate(
          async () => {
            const res = await fetch(
              `/api/madplan/indkob?ejerId=${ejerId}&aar=${aar}&uge=${uge}`,
              { method: 'DELETE' }
            )
            if (!res.ok) throw new Error('Failed to clear list')
            return []
          },
          {
            optimisticData: [],
            rollbackOnError: true,
            revalidate: false,
          }
        )
      } finally {
        setIsClearing(false)
      }
    },

    isAdding,
    isAddingMultiple,
    isClearing,
  }
}
