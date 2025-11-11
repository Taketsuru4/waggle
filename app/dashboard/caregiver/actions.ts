"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCaregiverProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Parse services
  const acceptsDogs = formData.get("accepts_dogs") === "on";
  const acceptsCats = formData.get("accepts_cats") === "on";
  const acceptsBirds = formData.get("accepts_birds") === "on";
  const acceptsRabbits = formData.get("accepts_rabbits") === "on";
  const acceptsOther = formData.get("accepts_other") === "on";

  const hourlyRate = formData.get("hourly_rate");

  // Create caregiver profile
  const { error: caregiverError } = await supabase
    .from("caregiver_profiles")
    .insert({
      user_id: user.id,
      bio: formData.get("bio") as string,
      experience_years: Number.parseInt(
        formData.get("experience_years") as string,
      ),
      hourly_rate: hourlyRate ? Number.parseFloat(hourlyRate as string) : null,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      postal_code: formData.get("postal_code") as string,
      accepts_dogs: acceptsDogs,
      accepts_cats: acceptsCats,
      accepts_birds: acceptsBirds,
      accepts_rabbits: acceptsRabbits,
      accepts_other: acceptsOther,
      available: true,
      contact_phone: (formData.get("contact_phone") as string) || null,
      whatsapp: (formData.get("whatsapp") as string) || null,
      viber: (formData.get("viber") as string) || null,
    });

  if (caregiverError) {
    console.error("Error creating caregiver profile:", caregiverError);
    return { error: caregiverError.message };
  }

  // Update user role to include caregiver
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const newRole = profile?.role === "owner" ? "both" : ("caregiver" as const);

  const { error: roleError } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", user.id);

  if (roleError) {
    console.error("Error updating role:", roleError);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateCaregiverProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Parse services
  const acceptsDogs = formData.get("accepts_dogs") === "on";
  const acceptsCats = formData.get("accepts_cats") === "on";
  const acceptsBirds = formData.get("accepts_birds") === "on";
  const acceptsRabbits = formData.get("accepts_rabbits") === "on";
  const acceptsOther = formData.get("accepts_other") === "on";
  const available = formData.get("available") === "on";

  const hourlyRate = formData.get("hourly_rate");

  // Update caregiver profile
  const { error } = await supabase
    .from("caregiver_profiles")
    .update({
      bio: formData.get("bio") as string,
      experience_years: Number.parseInt(
        formData.get("experience_years") as string,
      ),
      hourly_rate: hourlyRate ? Number.parseFloat(hourlyRate as string) : null,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      postal_code: formData.get("postal_code") as string,
      accepts_dogs: acceptsDogs,
      accepts_cats: acceptsCats,
      accepts_birds: acceptsBirds,
      accepts_rabbits: acceptsRabbits,
      accepts_other: acceptsOther,
      available: available,
      contact_phone: (formData.get("contact_phone") as string) || null,
      whatsapp: (formData.get("whatsapp") as string) || null,
      viber: (formData.get("viber") as string) || null,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating caregiver profile:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
