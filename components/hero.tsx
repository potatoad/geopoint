import { createClient } from "@/lib/supabase/server"
import { MapView } from "@/components/map-view"
import type { Feature } from "@/app/types/types"

export async function Hero() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_points_geojson")

  if (error) {
    console.error(error)
    return null
  }

  const features = (data?.features ?? []) as Feature[]

  return <MapView features={features} />
}
