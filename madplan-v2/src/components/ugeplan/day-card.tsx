'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X, ShoppingCart } from 'lucide-react'
import type { DagEntry, DagNavn } from '@/lib/types'
import { cn } from '@/lib/utils'

// Danish day names for display
const DAG_LABELS: Record<DagNavn, string> = {
  mandag: 'Mandag',
  tirsdag: 'Tirsdag',
  onsdag: 'Onsdag',
  torsdag: 'Torsdag',
  fredag: 'Fredag',
  loerdag: 'Lørdag',
  soendag: 'Søndag',
}

interface DayCardProps {
  dag: DagNavn
  dato: string          // Formatted date string e.g. "24. jan"
  entry: DagEntry | null
  opskriftId?: string   // Recipe ID for linking to recipe page
  onAdd: () => void     // Opens recipe picker
  onDelete: () => void
  onAddToShoppingList?: () => void  // Add ingredients to shopping list
  onNoteChange?: (note: string) => void  // Update note on meal entry
  isToday?: boolean
  isMutating?: boolean
  billedeUrl?: string | null  // Recipe image URL
}

export function DayCard({
  dag,
  dato,
  entry,
  opskriftId,
  onAdd,
  onDelete,
  onAddToShoppingList,
  onNoteChange,
  isToday = false,
  isMutating = false,
  billedeUrl,
}: DayCardProps) {
  const hasRet = entry?.ret && entry.ret.trim() !== ''
  const [noteValue, setNoteValue] = useState(entry?.note ?? '')
  const lastSavedNote = useRef(entry?.note ?? '')

  // Update local state when entry changes (e.g., after fetch)
  const entryNote = entry?.note ?? ''
  if (entryNote !== lastSavedNote.current) {
    setNoteValue(entryNote)
    lastSavedNote.current = entryNote
  }

  const handleNoteBlur = useCallback(() => {
    const trimmedNote = noteValue.trim()
    // Only save if changed
    if (trimmedNote !== lastSavedNote.current && onNoteChange) {
      onNoteChange(trimmedNote)
      lastSavedNote.current = trimmedNote
    }
  }, [noteValue, onNoteChange])

  const handleNoteKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur()
      }
    },
    []
  )

  // Thumbnail component
  const Thumbnail = () => {
    if (!hasRet) return null
    if (billedeUrl) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={billedeUrl}
            alt={entry?.ret || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-olive-200 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-medium text-olive-700">
          {entry?.ret?.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  // Day info (day name, date, recipe title, note)
  const DayInfo = () => (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-medium text-foreground">
          {DAG_LABELS[dag]}
        </span>
        <span className="text-sm text-muted-foreground">
          {dato}
        </span>
      </div>
      {hasRet ? (
        <>
          <p className="text-base text-foreground truncate">
            {entry?.ret}
          </p>
          {entry?.note && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {entry.note}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Ingen ret planlagt
        </p>
      )}
    </div>
  )

  return (
    <Card className={cn(
      'transition-opacity',
      isToday && 'ring-2 ring-terracotta-500 ring-offset-2',
      isMutating && 'opacity-50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Recipe thumbnail and info - clickable when recipe is linked */}
          {hasRet && opskriftId ? (
            <Link
              href={`/opskrifter/${opskriftId}`}
              className="flex items-start gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <Thumbnail />
              <DayInfo />
            </Link>
          ) : (
            <>
              <Thumbnail />
              <DayInfo />
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {hasRet && onAddToShoppingList ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAddToShoppingList}
                disabled={isMutating}
                aria-label={`Tilfoej ingredienser fra ${entry?.ret} til indkoebsliste`}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            ) : null}

            {hasRet ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                disabled={isMutating}
                aria-label={`Fjern ${entry?.ret} fra ${DAG_LABELS[dag]}`}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={onAdd}
              disabled={isMutating}
              aria-label={`Tilfoej ret til ${DAG_LABELS[dag]}`}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Note input - only shown when there's a meal */}
        {hasRet && onNoteChange && (
          <div className="mt-2 pl-14">
            <Input
              type="text"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onBlur={handleNoteBlur}
              onKeyDown={handleNoteKeyDown}
              placeholder="Tilfoej note..."
              maxLength={50}
              disabled={isMutating}
              className="h-7 text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
