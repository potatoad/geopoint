'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addPoint(formData) {
  const supabase = await createClient()

  // 1. Verify the user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to add a point." }
  }

  // 2. Extract data from the form
  const label = formData.get('label')
  const lat = parseFloat(formData.get('lat'))
  const lon = parseFloat(formData.get('lon'))

  // Basic validation
  if (!label || isNaN(lat) || isNaN(lon)) {
    return { error: "Invalid form data." }
  }

  // 3. Insert into Supabase
  const { error } = await supabase
    .from('points')
    .insert({
      label: label,
      // Supabase parses this WKT string directly into your geography column
      location: `POINT(${lon} ${lat})` 
    })

  if (error) {
    console.error(error)
    return { error: "Failed to save point to the database." }
  }

  // 4. Tell Next.js to refresh the page/map with the new data
  revalidatePath('/') 
  
  return { success: true }
}