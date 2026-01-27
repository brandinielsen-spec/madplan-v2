'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { EjerSelector } from './ejer-selector'

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  headerLeft?: React.ReactNode;
}

export function Header({ title, actions, headerLeft }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Gå til forsiden"
          >
            <Home className="w-4 h-4 text-primary" />
          </Link>
          <EjerSelector />
          {headerLeft}
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
