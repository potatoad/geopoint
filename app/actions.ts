'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface PointActionState {
  success?: boolean
  error?: string | null
}

export async function addPoint(_prevState: PointActionState | null, formData: FormData): Promise<PointActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to add a point.' }
  }

  const name = formData.get('name')
  const age = formData.get('age')
  const lat = parseFloat(formData.get('lat')?.toString() ?? '')
  const lon = parseFloat(formData.get('lon')?.toString() ?? '')
  const desc = formData.get('desc')

  if (!name || Number.isNaN(lat) || Number.isNaN(lon)) {
    return { error: 'Please select a location and enter a name.' }
  }

  const { error } = await supabase.from('points').insert({
    name,
    age,
    location: `POINT(${lon} ${lat})`,
    desc,
  })

  if (error) {
    console.error(error)
    return { error: 'Failed to save point to the database.' }
  }

  revalidatePath('/')

  return { success: true, error: null }
}
