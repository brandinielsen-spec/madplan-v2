import useSWR, { mutate as globalMutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import type { Ugeplan, DagNavn } from '@/lib/types'

interface UpdateDagArgs {
  id: string           // Ugeplan record id
  feltNavn: string     // "Mandag", "Tirsdag", etc. (capitalized for Airtable)
  ret: string
  opskriftId?: string
  note?: string
}

interface UpdateNoteArgs {
  id: string           // Ugeplan record id
  feltNavn: string     // "Mandag", "Tirsdag", etc. (capitalized for Airtable)
  note: string         // Note text (empty string clears the note)
}

interface DeleteDagArgs {
  id: string
  feltNavn: string
}

async function updateDag(
  url: string,
  { arg }: { arg: UpdateDagArgs }
) {
  const res = await fetch('/api/madplan/dag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'opdater', ...arg }),
  })
  if (!res.ok) throw new Error('Failed to update day')
  return res.json()
}

async function deleteDag(
  url: string,
  { arg }: { arg: DeleteDagArgs }
) {
  const res = await fetch('/api/madplan/dag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'slet', ...arg }),
  })
  if (!res.ok) throw new Error('Failed to delete day')
  return res.json()
}

async function updateNote(
  url: string,
  { arg }: { arg: UpdateNoteArgs }
) {
  const res = await fetch('/api/madplan/dag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'note', ...arg }),
  })
  if (!res.ok) throw new Error('Failed to update note')
  return res.json()
}

export function useUgeplan(ejerId: string | null, aar: number, uge: number) {
  const key = ejerId
    ? `/api/madplan/uge?ejerId=${ejerId}&aar=${aar}&uge=${uge}`
    : null

  const { data, error, isLoading, mutate } = useSWR<Ugeplan>(key, {
    keepPreviousData: true,  // Smooth transition when navigating weeks
  })

  const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(
    key,
    updateDag,
    {
      revalidate: true,  // Refetch after update to get fresh data
    }
  )

  const { trigger: triggerDelete, isMutating: isDeleting } = useSWRMutation(
    key,
    deleteDag,
    {
      revalidate: true,
    }
  )

  const { trigger: triggerNote, isMutating: isUpdatingNote } = useSWRMutation(
    key,
    updateNote,
    {
      revalidate: true,
    }
  )

  // Helper to capitalize day name for Airtable field
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  // Current hook's week reference for comparison
  const currentHookWeek = { aar, uge }

  return {
    ugeplan: data,
    isLoading,
    isError: !!error,
    error,
    mutate,

    // Convenience methods
    updateDay: async (dag: DagNavn, ret: string, opskriftId?: string) => {
      if (!data?.id) throw new Error('No ugeplan loaded')
      return triggerUpdate({
        id: data.id,
        feltNavn: capitalize(dag),
        ret,
        opskriftId,
      })
    },

    deleteDay: async (dag: DagNavn) => {
      if (!data?.id) throw new Error('No ugeplan loaded')
      return triggerDelete({
        id: data.id,
        feltNavn: capitalize(dag),
      })
    },

    updateNote: async (dag: DagNavn, note: string) => {
      if (!data?.id) throw new Error('No ugeplan loaded')
      return triggerNote({
        id: data.id,
        feltNavn: capitalize(dag),
        note,
      })
    },

    // Add meal to a specific week (may differ from current hook's week)
    addDayToWeek: async (
      targetWeek: { aar: number; uge: number },
      dag: DagNavn,
      ret: string,
      opskriftId?: string
    ) => {
      if (!ejerId) throw new Error('No ejerId')

      // Build the target week's API key
      const targetKey = `/api/madplan/uge?ejerId=${ejerId}&aar=${targetWeek.aar}&uge=${targetWeek.uge}`

      // Fetch the target week's ugeplan to get its ID
      const targetRes = await fetch(targetKey)
      if (!targetRes.ok) throw new Error('Failed to fetch target week')
      let targetUgeplan: Ugeplan = await targetRes.json()

      // If week doesn't exist, create it first
      if (!targetUgeplan?.id) {
        const createRes = await fetch('/api/madplan/uge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ejerId,
            aar: targetWeek.aar,
            uge: targetWeek.uge,
          }),
        })
        if (!createRes.ok) throw new Error('Failed to create target week')
        const createResult = await createRes.json()
        // Use the newly created week's ID
        targetUgeplan = { id: createResult.id } as Ugeplan
      }

      // Make the update to the target week
      const updateRes = await fetch('/api/madplan/dag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'opdater',
          id: targetUgeplan.id,
          feltNavn: capitalize(dag),
          ret,
          opskriftId,
        }),
      })

      if (!updateRes.ok) throw new Error('Failed to update day in target week')

      // If target week differs from current hook's week, invalidate target week's cache
      if (targetWeek.aar !== currentHookWeek.aar || targetWeek.uge !== currentHookWeek.uge) {
        await globalMutate(targetKey)
      }

      // Also refresh current week data
      await mutate()

      return updateRes.json()
    },

    // Exposed for page-level comparison
    hookWeek: currentHookWeek,

    isMutating: isUpdating || isDeleting || isUpdatingNote,
  }
}
