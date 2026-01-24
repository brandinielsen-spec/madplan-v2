'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { WeekNav } from '@/components/ugeplan/week-nav'
import { DayCard } from '@/components/ugeplan/day-card'
import { RecipePicker } from '@/components/ugeplan/recipe-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { useUgeplan } from '@/hooks/use-ugeplan'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useEjere } from '@/hooks/use-ejere'
import { getCurrentWeek, navigateWeek, getWeekDates, formatDayDate } from '@/lib/week-utils'
import { DAGE, type DagNavn } from '@/lib/types'
import { getISOWeek, getISOWeekYear } from 'date-fns'

export default function UgeplanPage() {
  // Week state - start with current week
  const [week, setWeek] = useState(getCurrentWeek)

  // Selected day for recipe picker
  const [selectedDag, setSelectedDag] = useState<DagNavn | null>(null)

  // TODO: In a real app, ejerId would come from user selection/context
  // For now, use first ejer or null
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  // Data hooks
  const {
    ugeplan,
    isLoading: ugeplanLoading,
    isError: ugeplanError,
    updateDay,
    deleteDay,
    isMutating,
  } = useUgeplan(ejerId, week.aar, week.uge)

  const { opskrifter } = useOpskrifter(ejerId)

  // Calculate dates for the week
  const weekDates = useMemo(() => getWeekDates(week.aar, week.uge), [week.aar, week.uge])

  // Check if a date is today
  const today = new Date()
  const todayWeek = getISOWeek(today)
  const todayYear = getISOWeekYear(today)
  const todayDayIndex = (today.getDay() + 6) % 7  // Convert Sunday=0 to Monday=0

  // Extract recent meals from current ugeplan
  const recentRetter = useMemo(() => {
    if (!ugeplan?.dage) return []
    return Object.values(ugeplan.dage)
      .map((entry) => entry?.ret)
      .filter((ret): ret is string => !!ret && ret.trim() !== '')
  }, [ugeplan])

  // Handlers
  const handlePrevWeek = () => {
    setWeek(navigateWeek(week.aar, week.uge, 'prev'))
  }

  const handleNextWeek = () => {
    setWeek(navigateWeek(week.aar, week.uge, 'next'))
  }

  const handleAddMeal = (dag: DagNavn) => {
    setSelectedDag(dag)
  }

  const handleSelectMeal = async (ret: string, opskriftId?: string) => {
    if (!selectedDag) return
    try {
      await updateDay(selectedDag, ret, opskriftId)
      toast.success(`${ret} tilfojet`)
    } catch (error) {
      toast.error('Kunne ikke tilfoeje ret')
    } finally {
      setSelectedDag(null)
    }
  }

  const handleDeleteMeal = async (dag: DagNavn) => {
    try {
      await deleteDay(dag)
      toast.success('Ret fjernet')
    } catch (error) {
      toast.error('Kunne ikke fjerne ret')
    }
  }

  const isLoading = ejereLoading || ugeplanLoading

  return (
    <AppShell title="Ugeplan">
      <WeekNav
        aar={week.aar}
        uge={week.uge}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : ugeplanError ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Kunne ikke hente ugeplan</p>
          <p className="text-sm mt-1">Tjek din forbindelse og proev igen</p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {DAGE.map((dag, index) => {
            const isToday =
              week.aar === todayYear &&
              week.uge === todayWeek &&
              index === todayDayIndex

            return (
              <DayCard
                key={dag}
                dag={dag}
                dato={formatDayDate(weekDates[index])}
                entry={ugeplan?.dage?.[dag] ?? null}
                onAdd={() => handleAddMeal(dag)}
                onDelete={() => handleDeleteMeal(dag)}
                isToday={isToday}
                isMutating={isMutating}
              />
            )
          })}
        </div>
      )}

      {/* Recipe picker drawer - controlled by selectedDag */}
      <RecipePicker
        opskrifter={opskrifter}
        recentRetter={recentRetter}
        onSelect={handleSelectMeal}
        open={selectedDag !== null}
        onOpenChange={(open) => !open && setSelectedDag(null)}
        trigger={<span />}
      />
    </AppShell>
  )
}
