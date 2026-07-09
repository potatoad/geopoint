'use client'

import type { Age, Feature } from '@/app/types/types'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./map-view').then((mod) => mod.MapView), { ssr: false })

interface MapViewClientProps {
  features: Feature[]
  ages: Age[]
  isAuthed: boolean
}

export function MapViewClient({ features, ages, isAuthed }: MapViewClientProps): React.ReactElement {
  return <MapView features={features} ages={ages} isAuthed={isAuthed} />
}
