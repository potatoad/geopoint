"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type PointActionState = {
  success?: boolean;
  error?: string | null;
};

export async function addPoint(
  prevState: PointActionState | null,
  formData: FormData,
): Promise<PointActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to add a point." };
  }

  const label = formData.get("label");
  const color = formData.get("color");
  const lat = parseFloat(formData.get("lat")?.toString() ?? "");
  const lon = parseFloat(formData.get("lon")?.toString() ?? "");

  if (!label || Number.isNaN(lat) || Number.isNaN(lon)) {
    return { error: "Please select a location and enter a label." };
  }

  const { error } = await supabase.from("points").insert({
    label,
    color,
    location: `POINT(${lon} ${lat})`,
  });

  if (error) {
    console.error(error);
    return { error: "Failed to save point to the database." };
  }

  revalidatePath("/");

  return { success: true, error: null };
}
