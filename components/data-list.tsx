import { Feature } from '@/app/types/types'
import { createClient } from "@/lib/supabase/server"



export async function DataList() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('get_points_geojson')
  if (error) console.error(error)
  // else console.log(data)

  return data ? (
    <div className="flex items-center gap-4">
      <ul>
        {data.features.map((feature: Feature) => (
          <li key={feature.properties.id}>{feature.properties.name}</li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      Nothing here!
    </div>
  )
}
