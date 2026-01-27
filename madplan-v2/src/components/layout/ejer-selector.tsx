'use client'

import { useState } from 'react'
import { Check, ChevronDown, User, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useSelectedEjer } from '@/contexts/ejer-context'
import { useEjere } from '@/hooks/use-ejere'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function EjerSelector() {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newEjerName, setNewEjerName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { ejere, isLoading, createEjer } = useEjere()
  const { selectedEjer, setSelectedEjerId, isHydrated } = useSelectedEjer()

  // Don't render during loading or before hydration
  if (isLoading || !isHydrated) {
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

  const handleCreateEjer = async () => {
    if (!newEjerName.trim()) return

    setIsCreating(true)
    try {
      const newEjer = await createEjer(newEjerName.trim())
      setSelectedEjerId(newEjer.id)
      toast.success(`Ejer "${newEjer.navn}" oprettet`)
      setDialogOpen(false)
      setNewEjerName('')
      setOpen(false)
    } catch (error) {
      console.error('Create ejer error:', error)
      toast.error('Kunne ikke oprette ejer')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
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

            {/* Separator */}
            <div className="h-px bg-border my-1" />

            {/* Create new ejer button */}
            <button
              onClick={() => {
                setDialogOpen(true)
              }}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-muted-foreground/50">
                <Plus className="w-3 h-3" />
              </div>
              <span className="flex-1 text-left">Opret ny ejer</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Create ejer dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Opret ny ejer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Navn"
              value={newEjerName}
              onChange={(e) => setNewEjerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newEjerName.trim()) {
                  handleCreateEjer()
                }
              }}
              disabled={isCreating}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isCreating}
            >
              Annuller
            </Button>
            <Button
              onClick={handleCreateEjer}
              disabled={!newEjerName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opretter...
                </>
              ) : (
                'Opret'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
