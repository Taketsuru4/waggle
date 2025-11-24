"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAvailabilitySlot(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get caregiver profile
  const { data: caregiver } = await supabase
    .from("caregiver_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!caregiver) {
    return { error: "Caregiver profile not found" };
  }

  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;

  const { error } = await supabase.from("caregiver_availability").insert({
    caregiver_id: caregiver.id,
    date,
    start_time: startTime,
    end_time: endTime,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/caregivers/${caregiver.id}`);
  return { success: true };
}

export async function removeAvailabilitySlot(slotId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("caregiver_availability")
    .delete()
    .eq("id", slotId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getAvailabilitySlots(caregiverId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("caregiver_availability")
    .select("*")
    .eq("caregiver_id", caregiverId)
    .eq("is_available", true)
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return { error: error.message, data: null };
  }

  return { data, error: null };
}

export async function getCaregiverAvailability(
  caregiverId: string,
  date: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("caregiver_availability")
    .select("*")
    .eq("caregiver_id", caregiverId)
    .eq("date", date)
    .eq("is_available", true)
    .order("start_time", { ascending: true });

  if (error) {
    return { error: error.message, data: null };
  }

  return { data, error: null };
}
