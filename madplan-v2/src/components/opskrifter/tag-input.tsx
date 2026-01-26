'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  existingTags: string[]
  currentTags: string[]
  onAddTag: (tag: string) => void
  className?: string
}

export function TagInput({ existingTags, currentTags, onAddTag, className }: TagInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // Filter suggestions: existing tags not already on this recipe
  const suggestions = existingTags
    .filter((tag) => !currentTags.includes(tag))
    .filter((tag) => tag.toLowerCase().includes(inputValue.toLowerCase()))

  const handleSelect = (tag: string) => {
    onAddTag(tag)
    setInputValue('')
    setOpen(false)
  }

  const handleCreateNew = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !currentTags.includes(trimmed)) {
      onAddTag(trimmed)
      setInputValue('')
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1 text-muted-foreground", className)}
        >
          <Plus className="h-3 w-3" />
          Tilføj tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Søg eller opret tag..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {suggestions.length === 0 && inputValue.trim() ? (
              <CommandEmpty>
                <button
                  onClick={handleCreateNew}
                  className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent rounded"
                >
                  Opret &quot;{inputValue.trim()}&quot;
                </button>
              </CommandEmpty>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>
                <span className="text-muted-foreground text-sm">
                  Skriv for at oprette nyt tag
                </span>
              </CommandEmpty>
            ) : null}
            {suggestions.length > 0 && (
              <CommandGroup>
                {suggestions.slice(0, 10).map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleSelect(tag)}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
