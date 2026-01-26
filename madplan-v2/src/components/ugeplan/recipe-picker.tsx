'use client'

import { useState, useEffect } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { WeekPicker } from './week-picker'
import { getCurrentWeek } from '@/lib/week-utils'
import type { Opskrift } from '@/lib/types'

interface RecipePickerProps {
  opskrifter: Opskrift[]
  recentRetter: string[]        // Recently used meal names
  onSelect: (ret: string, opskriftId: string | undefined, selectedWeek: { aar: number; uge: number }) => void
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function RecipePicker({
  opskrifter,
  recentRetter,
  onSelect,
  trigger,
  open,
  onOpenChange,
}: RecipePickerProps) {
  const [search, setSearch] = useState('')
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek)

  // Reset selected week to current week when drawer opens
  useEffect(() => {
    if (open) {
      setSelectedWeek(getCurrentWeek())
    }
  }, [open])

  const filteredOpskrifter = opskrifter.filter((o) =>
    o.titel.toLowerCase().includes(search.toLowerCase())
  )

  // Filter recent that aren't in current search
  const filteredRecent = recentRetter.filter((r) =>
    r.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (ret: string, opskriftId?: string) => {
    onSelect(ret, opskriftId, selectedWeek)
    setSearch('')  // Reset search on select
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Vælg ret</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <WeekPicker
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søg i opskrifter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="h-[50vh] px-4">
          {/* Recent meals section */}
          {filteredRecent.length > 0 && !search && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Senest brugte
              </h3>
              <div className="space-y-1">
                {filteredRecent.slice(0, 5).map((ret) => (
                  <DrawerClose key={ret} asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 px-3"
                      onClick={() => handleSelect(ret)}
                    >
                      {ret}
                    </Button>
                  </DrawerClose>
                ))}
              </div>
            </div>
          )}

          {/* All recipes section */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {search ? 'Resultater' : 'Alle opskrifter'}
            </h3>
            {filteredOpskrifter.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {search ? 'Ingen opskrifter matcher' : 'Ingen opskrifter endnu'}
              </p>
            ) : (
              <div className="space-y-1">
                {filteredOpskrifter.map((opskrift) => (
                  <DrawerClose key={opskrift.id} asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 px-3"
                      onClick={() => handleSelect(opskrift.titel, opskrift.id)}
                    >
                      {opskrift.titel}
                    </Button>
                  </DrawerClose>
                ))}
              </div>
            )}
          </div>

          {/* Quick add custom meal */}
          {search && !filteredOpskrifter.some(o => o.titel.toLowerCase() === search.toLowerCase()) && (
            <div className="mt-4 pt-4 border-t">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSelect(search)}
                >
                  Tilføj "{search}" som ret
                </Button>
              </DrawerClose>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
