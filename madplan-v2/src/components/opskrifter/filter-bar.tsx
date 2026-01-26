'use client'

import { Heart } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type TagState = 'include' | 'exclude'

interface FilterBarProps {
  allTags: string[]
  tagStates: Record<string, TagState>
  onTagToggle: (tag: string) => void
  showFavoritesOnly: boolean
  onFavoritesToggle: () => void
}

export function FilterBar({
  allTags,
  tagStates,
  onTagToggle,
  showFavoritesOnly,
  onFavoritesToggle,
}: FilterBarProps) {
  // Show bar if there are tags to filter, or if favorites filter is currently active
  if (allTags.length === 0 && !showFavoritesOnly) {
    return null
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {/* Favorites filter chip */}
        <button
          onClick={onFavoritesToggle}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors",
            "border focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400",
            showFavoritesOnly
              ? "bg-terracotta-100 text-terracotta-700 border-terracotta-300"
              : "bg-background text-muted-foreground border-input hover:bg-sand-100"
          )}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5",
              showFavoritesOnly && "fill-terracotta-500 text-terracotta-500"
            )}
          />
          Favoritter
        </button>

        {/* Tag filter chips - 3 states: none, include (green), exclude (red) */}
        {allTags.map((tag) => {
          const state = tagStates[tag]
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                "border focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-400",
                state === 'include'
                  ? "bg-olive-100 text-olive-700 border-olive-300"
                  : state === 'exclude'
                    ? "bg-red-100 text-red-700 border-red-300 line-through"
                    : "bg-background text-muted-foreground border-input hover:bg-sand-100"
              )}
            >
              {state === 'exclude' && '−'}{tag}
            </button>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
