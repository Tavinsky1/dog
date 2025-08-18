'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPlaceView } from '@/lib/analytics'

interface PlaceAnalyticsProps {
  placeId: string
  placeName: string
  category: string
}

export default function PlaceAnalytics({ placeId, placeName, category }: PlaceAnalyticsProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track place view when component mounts
    trackPlaceView(placeId, placeName, category)
  }, [placeId, placeName, category])

  return null // This component doesn't render anything
}
