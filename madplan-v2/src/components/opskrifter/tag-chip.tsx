'use client'

import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagChipProps {
  tag: string
  onRemove?: () => void
  className?: string
}

export function TagChip({ tag, onRemove, className }: TagChipProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-olive-100 text-olive-700 hover:bg-olive-200 border-olive-200",
        "transition-colors",
        className
      )}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:text-olive-900 focus:outline-none"
          aria-label={`Fjern tag ${tag}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}
