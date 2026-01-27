'use client'

import { useState } from 'react'
import { Check, ChevronDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSelectedEjer } from '@/contexts/ejer-context'
import { useEjere } from '@/hooks/use-ejere'
import { cn } from '@/lib/utils'

export function EjerSelector() {
  const [open, setOpen] = useState(false)
  const { ejere, isLoading } = useEjere()
  const { selectedEjer, setSelectedEjerId, isHydrated } = useSelectedEjer()

  // Don't render during loading or before hydration
  // Hide if only one ejer (no need to select)
  if (isLoading || !isHydrated || ejere.length <= 1) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-muted-foreground"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {selectedEjer ? (
              getInitials(selectedEjer.navn)
            ) : (
              <User className="w-3 h-3" />
            )}
          </div>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          {ejere.map((ejer) => (
            <button
              key={ejer.id}
              onClick={() => {
                setSelectedEjerId(ejer.id)
                setOpen(false)
              }}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md',
                'hover:bg-muted transition-colors',
                selectedEjer?.id === ejer.id && 'bg-muted'
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {getInitials(ejer.navn)}
              </div>
              <span className="flex-1 text-left">{ejer.navn}</span>
              {selectedEjer?.id === ejer.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
