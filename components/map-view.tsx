"use client"

import "maplibre-gl/dist/maplibre-gl.css"
import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    RMap, RMarker, RLayer,
    RSource,
    RTerrainControl,
} from "maplibre-react-components"
import type { Feature } from "@/app/types/types"
import { addPoint } from "@/app/actions"
import CustomMarker from './custom-marker'

const rasterDemTiles = [
    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
]

type MapViewProps = {
    features: Feature[]
}

type SelectedLocation = {
    lat: number
    lon: number
}

const initialState = {
    success: false,
    error: null as string | null,
}

export function MapView({ features }: MapViewProps) {
    const brighton: [number, number] = [-0.18859, 50.8373889]
    const router = useRouter()
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
    const [label, setLabel] = useState("")
    const [color, setColor] = useState("")
    const [state, formAction, isPending] = useActionState(addPoint, initialState)

    useEffect(() => {
        if (state.success) {
            setSelectedLocation(null)
            setLabel("")
            router.refresh()
        }
    }, [router, state.success])

    return (
        <div className="flex flex-col gap-6 items-center">
            <RMap
                style={{ minHeight: "50vh", width: "100%" }}
                minZoom={6}
                initialCenter={brighton}
                initialZoom={11}
                onClick={(event) => {
                    const { lngLat } = event
                    setSelectedLocation({ lat: lngLat.lat, lon: lngLat.lng })
                }}
                mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
            >
                <RSource
                    type="raster-dem"
                    id="terrarium"
                    tiles={rasterDemTiles}
                    encoding="terrarium"
                    tileSize={256}
                />
                <RLayer id="hillshade" type="hillshade" source="terrarium" />
                <RTerrainControl
                    source="terrarium"
                    position="top-left"
                    exaggeration={1.1}
                />
                {features.map((feature) => (
                    <RMarker
                        key={feature.properties.id}
                        longitude={feature.geometry.coordinates[0]}
                        latitude={feature.geometry.coordinates[1]}
                        initialAnchor="bottom"
                    >
                        <CustomMarker color={feature.properties.color} />
                    </RMarker>
                ))}
                {selectedLocation && (
                    <RMarker
                        longitude={selectedLocation.lon}
                        latitude={selectedLocation.lat}
                    >
                    </RMarker>
                )}
            </RMap>

            <form action={formAction} className="w-full max-w-xl rounded-lg border bg-background/80 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Add a new point</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Click on the map to choose a location, then enter a label and save it.
                </p>

                <div className="flex flex-col gap-4">
                    <div className='flex flex-row gap-3'><input
                        name="label"
                        value={label}
                        onChange={(event) => setLabel(event.target.value)}
                        placeholder="Point label"
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                        <input
                            name='color'
                            type='color'
                            placeholder='Color'
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                        /></div>
                    <input type="hidden" name="lat" value={selectedLocation?.lat ?? ""} />
                    <input type="hidden" name="lon" value={selectedLocation?.lon ?? ""} />

                    <div className="rounded border bg-muted/30 p-3 text-sm">
                        {selectedLocation ? (
                            <span>
                                Selected location: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lon.toFixed(5)}
                            </span>
                        ) : (
                            <span>Click on the map to set the location.</span>
                        )}
                    </div>

                    {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
                    {state.success ? <p className="text-sm text-green-600">Point saved.</p> : null}

                    <button
                        type="submit"
                        disabled={!selectedLocation || isPending}
                        className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isPending ? "Saving..." : "Save point"}
                    </button>
                </div>
            </form>

            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
        </div>
    )
}
