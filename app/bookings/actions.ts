"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const caregiverId = formData.get("caregiver_id") as string;
  const petId = formData.get("pet_id") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;
  const notes = formData.get("notes") as string;

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return {
      error: "Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης",
    };
  }

  const { error } = await supabase.from("bookings").insert({
    owner_id: user.id,
    caregiver_id: caregiverId,
    pet_id: petId,
    start_date: startDate,
    end_date: endDate,
    notes: notes || null,
    status: "pending",
  });

  if (error) {
    console.error("Error creating booking:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function acceptBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify user is the caregiver for this booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("caregiver_id, caregiver_profiles!inner(user_id)")
    .eq("id", bookingId)
    .single();

  if (
    !booking ||
    !booking.caregiver_profiles ||
    (booking.caregiver_profiles as { user_id: string }).user_id !== user.id
  ) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "accepted" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error accepting booking:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function declineBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify user is the caregiver for this booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("caregiver_id, caregiver_profiles!inner(user_id)")
    .eq("id", bookingId)
    .single();

  if (
    !booking ||
    !booking.caregiver_profiles ||
    (booking.caregiver_profiles as { user_id: string }).user_id !== user.id
  ) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "declined" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error declining booking:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify user is the owner of this booking
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Error cancelling booking:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function completeBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user is the owner
  const { data: ownerCheck } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", bookingId)
    .eq("owner_id", user.id)
    .single();

  // Check if user is the caregiver
  const { data: caregiverCheck } = await supabase
    .from("bookings")
    .select("id, caregiver_profiles!inner(user_id)")
    .eq("id", bookingId)
    .eq("caregiver_profiles.user_id", user.id)
    .single();

  // User must be either owner or caregiver
  if (!ownerCheck && !caregiverCheck) {
    return { error: "Unauthorized" };
  }

  // Update booking status
  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error completing booking:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
