export interface Feature {
  type: string
  location: {
    type: string
    coordinates: [number, number]
  }
  id: number
  name: string
  period: string
  age_name: string
  age_color: string
  desc: string
}

export interface Age {
  id: number
  created_at: string
  name: string
  epoch: number
  color: string
  start: number
  events: string
}
