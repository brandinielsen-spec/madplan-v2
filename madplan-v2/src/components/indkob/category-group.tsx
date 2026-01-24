'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingItem } from './shopping-item'
import type { Indkoebspost } from '@/lib/types'

interface CategoryGroupProps {
  title: string
  items: Indkoebspost[]
  onToggle: (id: string, checked: boolean) => void
}

export function CategoryGroup({ title, items, onToggle }: CategoryGroupProps) {
  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="divide-y divide-sand-200">
          {items.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              onToggle={onToggle}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
