import "maplibre-gl/dist/maplibre-gl.css"
import { RMap, RMarker } from "maplibre-react-components"
import { createClient } from "@/lib/supabase/server"
import { Feature } from '@/app/types/types'

export async function Hero() {
  const brighton: [number, number] = [-0.18859, 50.8373889]

  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('get_points_geojson')
  if (error) console.error(error)
  else console.log(data)


  return (
    <div className="flex flex-col gap-16 items-center">
      <RMap
        style={{ minHeight: '50vh', width: '100%' }}
        minZoom={6}
        initialCenter={brighton}
        initialZoom={11}
        mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
      >
        {data.features.map((feature: Feature)=>(
          <RMarker key={feature.properties.id} longitude={feature.geometry.coordinates[0]} latitude={feature.geometry.coordinates[1]}/>
        ))}
      </RMap>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  )
}
