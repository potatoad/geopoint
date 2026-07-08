'use client'

import { addPoint } from '@/app/actions'
import type { Feature, Period } from '@/app/types/types'
import 'maplibre-gl/dist/maplibre-gl.css'
import { RLayer, RMap, RMarker, RSource, RTerrainControl } from 'maplibre-react-components'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import CustomMarker from './custom-marker'

const rasterDemTiles = ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']

interface MapViewProps {
  features: Feature[]
  periods: Period[]
  isAuthed: boolean
}

interface SelectedLocation {
  lat: number
  lon: number
}

const initialState = {
  success: false,
  error: null as string | null,
}

export function MapView({ features, periods, isAuthed }: MapViewProps): React.ReactElement {
  const brighton: [number, number] = [-0.18859, 50.8373889]
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
  const [name, setName] = useState('')
  const [newPeriod, setNewPeriod] = useState('')
  const [state, formAction, isPending] = useActionState(addPoint, initialState)
  const [infoBox, setInfoBox] = useState({
    name: '',
    description: '',
    color: '',
    period: '',
  })

  useEffect(() => {
    if (state.success) {
      setSelectedLocation(null)
      setName('')
      router.refresh()
    }
  }, [router, state.success])

  return (
    <div className='flex flex-row gap-6 items-center'>
      <RMap
        style={{ minHeight: '50vh', width: '100%' }}
        minZoom={6}
        initialCenter={brighton}
        initialZoom={11}
        onClick={(event) => {
          const { lngLat } = event
          setSelectedLocation({ lat: lngLat.lat, lon: lngLat.lng })
        }}
        mapStyle='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
      >
        <RSource type='raster-dem' id='terrarium' tiles={rasterDemTiles} encoding='terrarium' tileSize={256} />
        <RLayer id='hillshade' type='hillshade' source='terrarium' />
        <RTerrainControl source='terrarium' position='top-left' exaggeration={1.1} />
        {features.map((feature) => (
          <RMarker
            key={feature.properties.id}
            longitude={feature.geometry.coordinates[0]}
            latitude={feature.geometry.coordinates[1]}
            initialAnchor='bottom'
            onClick={(event) => {
              event.stopPropagation()
              setInfoBox({
                name: feature.properties.name,
                description: feature.properties.description,
                color: feature.properties.color,
                period: feature.properties.period,
              })
            }}
          >
            <CustomMarker color={feature.properties.color} />
          </RMarker>
        ))}
        {selectedLocation && <RMarker longitude={selectedLocation.lon} latitude={selectedLocation.lat}></RMarker>}
      </RMap>

      <div className='flex flex-col gap-3'>
        <div className='w-full max-w-xl rounded-lg border bg-background/80 p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>{infoBox.name}</h3>
          <h4 className='subtitle' style={{ color: infoBox.color }}>
            {infoBox.period}
          </h4>
        </div>

        {isAuthed && (
          <form action={formAction} className='w-full max-w-xl rounded-lg border bg-background/80 p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold'>Add a new point</h3>
            <p className='mb-4 text-sm text-muted-foreground'>
              Click on the map to choose a location, then enter a name and save it.
            </p>

            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-3'>
                <input
                  name='name'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='Point name'
                  required
                  className='w-full rounded border px-3 py-2'
                />
              </div>
              <input type='hidden' name='lat' value={selectedLocation?.lat ?? ''} />
              <input type='hidden' name='lon' value={selectedLocation?.lon ?? ''} />

              <div className='rounded border bg-muted/30 p-3 text-sm'>
                {selectedLocation ? (
                  <span>
                    Selected location: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lon.toFixed(5)}
                  </span>
                ) : (
                  <span>Click on the map to set the location.</span>
                )}
              </div>
              <label>Period</label>
              <select
                name='period'
                required
                className='rounded py-2 px-3'
                defaultValue='Select Period'
                value={newPeriod}
                onChange={(event) => {
                  setNewPeriod(event.target.value)
                }}
              >
                <option key='none' value=''>
                  Select Period
                </option>
                {periods?.map((period) => (
                  <option key={period.id} value={period.name}>
                    {period.name}
                  </option>
                ))}
              </select>

              <div>
                <input className='rounded py-2 px-3 w-full' placeholder='Description' type='textarea'></input>
              </div>

              {state.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
              {state.success ? <p className='text-sm text-green-600'>Point saved.</p> : null}

              <button
                type='submit'
                disabled={!selectedLocation || isPending}
                className='rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
              >
                {isPending ? 'Saving...' : 'Save point'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
