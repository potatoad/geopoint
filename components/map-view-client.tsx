'use client'

import type { Feature, Period } from '@/app/types/types'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./map-view').then((mod) => mod.MapView), { ssr: false })

interface MapViewClientProps {
  features: Feature[]
  periods: Period[]
  isAuthed: boolean
}

export function MapViewClient({ features, periods, isAuthed }: MapViewClientProps): React.ReactElement {
  return <MapView features={features} periods={periods} isAuthed={isAuthed} />
}
