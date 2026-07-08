export interface Feature {
  type: string
  geometry: {
    type: string
    coordinates: [number,number]
  }
  properties: {
    id: number
    name: string
    period: string
    color: string
    description: string
  }
}

export interface Period {
  color: string
  created_at: string
  id: number
  name: string
}