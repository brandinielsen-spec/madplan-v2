'use client'

import { useEffect, useState } from 'react'
import { useOnlineStatus } from '@/hooks/use-online-status'

/**
 * Offline Banner Component
 * Shows a subtle persistent banner when user is offline
 * Uses 2-second debounce to prevent flashing on unstable connections
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const [showBanner, setShowBanner] = useState(false)

  // Debounce offline status to prevent flashing
  useEffect(() => {
    if (!isOnline) {
      // Wait 2 seconds before showing banner
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
    // When back online, hide banner immediately
    setShowBanner(false)
  }, [isOnline])

  if (!showBanner) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-amber-100 text-amber-800 text-center py-2 text-sm font-medium z-50 shadow-sm"
      role="alert"
      aria-live="polite"
    >
      Du er offline
    </div>
  )
}
