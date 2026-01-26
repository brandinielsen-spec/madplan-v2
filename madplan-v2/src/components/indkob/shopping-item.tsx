'use client'

import { Checkbox } from '@/components/ui/checkbox'
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

  const getSourceText = () => {
    if (item.kilde === 'manuel') return 'Tilføjet manuelt'
    // For items from recipes, show recipe name if available
    if (item.kildeNavn) return item.kildeNavn
    return 'Fra opskrift'  // Fallback if kildeNavn not provided
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-2 px-1 cursor-pointer rounded-md',
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

      <div className="flex-1 min-w-0 flex items-baseline gap-2">
        <span className={cn('text-base', item.afkrydset && 'line-through text-muted-foreground')}>
          {item.navn}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {getSourceText()}
        </span>
      </div>
    </div>
  )
}
