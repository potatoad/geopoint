import { addPoint } from "@/app/actions"
import { createClient } from '@/lib/supabase/client'

export default async function AddPointForm() {
      const supabase = await createClient();
    
      // You can also use getUser() which will be slower.
      const { data } = await supabase.auth.getClaims();
       const user = data?.claims;
       console.log(user)
       
  const handleAddPoint = async (formData: FormData) => {
    await addPoint(formData)
  }

  if (user) return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-xl font-bold mb-4">Add New POI</h2>
      
      <form action={handleAddPoint} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input 
            type="text" 
            name="label" 
            required 
            className="w-full border p-2 rounded"
            placeholder="Central Park"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input 
              type="number" 
              step="any" 
              name="lat" 
              required 
              className="w-full border p-2 rounded"
              placeholder="40.7812"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input 
              type="number" 
              step="any" 
              name="lon" 
              required 
              className="w-full border p-2 rounded"
              placeholder="-73.9665"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save Point
        </button>
      </form>
    </div>
  )
}