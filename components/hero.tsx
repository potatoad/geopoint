import type { Feature } from '@/app/types/types'
import { MapViewClient } from '@/components/map-view-client'
import { createClient } from '@/lib/supabase/server'

export async function Hero(): Promise<React.ReactElement | null> {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getClaims()
  const { data: points, error: pointError } = await supabase.rpc('get_points_geojson')
  const { data: ages, error: periodsError } = await supabase.from('ages').select()

  if (userError) {
    console.error(userError)
    return null
  }

  if (pointError) {
    console.error(pointError)
    return null
  }

  if (periodsError) {
    console.error(periodsError)
    return null
  }

  const features = (points?.features ?? []) as Feature[]

  return <MapViewClient features={features} ages={ages} isAuthed={user?.claims ? true : false} />
}
