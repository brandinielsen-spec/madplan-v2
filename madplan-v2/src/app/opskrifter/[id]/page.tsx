'use client'

import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import type { Opskrift } from '@/lib/types'
import { useEjere } from '@/hooks/use-ejere'

export default function OpskriftDetailPage() {
  const params = useParams()
  const opskriftId = params.id as string

  // TODO: ejerId from user context
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  // Fetch single recipe - for now, fetch all and filter
  // Could optimize with dedicated endpoint later
  const { data: opskrifter, isLoading: opskrifterLoading } = useSWR<Opskrift[]>(
    ejerId ? `/api/madplan/opskrifter?ejerId=${ejerId}` : null
  )

  const opskrift = opskrifter?.find((o) => o.id === opskriftId)
  const isLoading = ejereLoading || opskrifterLoading

  return (
    <AppShell
      title={opskrift?.titel ?? 'Opskrift'}
      headerLeft={
        <Link href="/opskrifter">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !opskrift ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Opskrift ikke fundet</p>
            <Link href="/opskrifter" className="text-primary underline mt-2 inline-block">
              Tilbage til opskrifter
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 pb-4">
          {/* Title and portions */}
          <div>
            <h1 className="text-2xl font-heading font-bold">{opskrift.titel}</h1>
            <p className="text-muted-foreground">{opskrift.portioner} portioner</p>
          </div>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredienser</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {opskrift.ingredienser.map((ingrediens, i) => (
                  <li key={i} className="text-foreground">
                    {ingrediens}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fremgangsmaade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {opskrift.fremgangsmaade}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
