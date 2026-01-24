'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { DagEntry, DagNavn } from '@/lib/types'
import { cn } from '@/lib/utils'

// Danish day names for display
const DAG_LABELS: Record<DagNavn, string> = {
  mandag: 'Mandag',
  tirsdag: 'Tirsdag',
  onsdag: 'Onsdag',
  torsdag: 'Torsdag',
  fredag: 'Fredag',
  loerdag: 'Lordag',
  soendag: 'Sondag',
}

interface DayCardProps {
  dag: DagNavn
  dato: string          // Formatted date string e.g. "24. jan"
  entry: DagEntry | null
  onAdd: () => void     // Opens recipe picker
  onDelete: () => void
  isToday?: boolean
  isMutating?: boolean
}

export function DayCard({
  dag,
  dato,
  entry,
  onAdd,
  onDelete,
  isToday = false,
  isMutating = false,
}: DayCardProps) {
  const hasRet = entry?.ret && entry.ret.trim() !== ''

  return (
    <Card className={cn(
      'transition-opacity',
      isToday && 'ring-2 ring-terracotta-500 ring-offset-2',
      isMutating && 'opacity-50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
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
              <p className="text-base text-foreground truncate">
                {entry.ret}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Ingen ret planlagt
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {hasRet ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                disabled={isMutating}
                aria-label={`Fjern ${entry.ret} fra ${DAG_LABELS[dag]}`}
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
      </CardContent>
    </Card>
  )
}
