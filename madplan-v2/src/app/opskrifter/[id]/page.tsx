'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import { toast } from 'sonner'
import type { Opskrift } from '@/lib/types'
import { useEjere } from '@/hooks/use-ejere'

export default function OpskriftDetailPage() {
  const params = useParams()
  const router = useRouter()
  const opskriftId = params.id as string
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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

  const handleDelete = async () => {
    if (!opskriftId) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/madplan/opskrift', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opskriftId }),
      })

      if (!response.ok) {
        throw new Error('Kunne ikke slette opskrift')
      }

      toast.success('Opskrift slettet')
      // Invalidate cache and redirect
      mutate(`/api/madplan/opskrifter?ejerId=${ejerId}`)
      router.push('/opskrifter')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Kunne ikke slette opskrift')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

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

          {/* Recipe image if available */}
          {opskrift.billedeUrl && (
            <div className="rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opskrift.billedeUrl}
                alt={opskrift.titel}
                className="w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}

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

          {/* Source link if available */}
          {opskrift.kilde && (
            <div className="text-sm text-muted-foreground">
              <span>Kilde: </span>
              <a
                href={opskrift.kilde}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {new URL(opskrift.kilde).hostname}
              </a>
            </div>
          )}

          {/* Delete button */}
          <div className="pt-4 border-t">
            {showConfirm ? (
              <div className="space-y-2">
                <p className="text-sm text-destructive">
                  Er du sikker på at du vil slette denne opskrift?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? 'Sletter...' : 'Ja, slet'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    Annuller
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Slet opskrift
              </Button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  )
}
