'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { Indkoebspost } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ShoppingItemProps {
  item: Indkoebspost
  onToggle: (id: string, checked: boolean) => void
}

export function ShoppingItem({ item, onToggle }: ShoppingItemProps) {
  const handleClick = () => {
    onToggle(item.id, !item.afkrydset)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 px-1 cursor-pointer rounded-md',
        'hover:bg-sand-100 active:bg-sand-200 transition-colors',
        item.afkrydset && 'opacity-60'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <Checkbox
        checked={item.afkrydset}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto"
      />

      <span
        className={cn(
          'flex-1 text-base',
          item.afkrydset && 'line-through text-muted-foreground'
        )}
      >
        {item.navn}
      </span>

      {item.kilde === 'manuel' && (
        <Badge variant="outline" className="text-xs">
          manuel
        </Badge>
      )}
    </div>
  )
}
