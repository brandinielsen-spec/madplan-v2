import useSWR from 'swr'
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

    isMutating: isUpdating || isDeleting || isUpdatingNote,
  }
}
