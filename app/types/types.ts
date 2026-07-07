export interface Feature {
  type: string
  geometry: {
    type: string
    coordinates: [number,number]
  }
  properties: {
    id: number
    label: string
    color: string
  }
}