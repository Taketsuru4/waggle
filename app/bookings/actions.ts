"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "@/lib/data/notifications";

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

  const { data: newBooking, error } = await supabase
    .from("bookings")
    .insert({
      owner_id: user.id,
      caregiver_id: caregiverId,
      pet_id: petId,
      start_date: startDate,
      end_date: endDate,
      notes: notes || null,
      status: "pending",
    })
    .select("id, caregiver_profiles!inner(user_id)")
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return { error: error.message };
  }

  // Notify caregiver about new booking request
  if (newBooking && newBooking.caregiver_profiles) {
    const caregiverProfile = Array.isArray(newBooking.caregiver_profiles)
      ? newBooking.caregiver_profiles[0]
      : newBooking.caregiver_profiles;
    await createNotification({
      userId: (caregiverProfile as { user_id: string }).user_id,
      type: "booking_request",
      title: "Νέο Αίτημα Κράτησης",
      message: "Έλαβες ένα νέο αίτημα κράτησης από έναν ιδιοκτήτη.",
      link: `/bookings/${newBooking.id}`,
    });
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

  const caregiverProfile =
    booking && booking.caregiver_profiles
      ? ((Array.isArray(booking.caregiver_profiles)
          ? booking.caregiver_profiles[0]
          : booking.caregiver_profiles) as { user_id: string })
      : null;

  if (!booking || !caregiverProfile || caregiverProfile.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Get booking details with owner info
  const { data: bookingDetails } = await supabase
    .from("bookings")
    .select("owner_id")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "accepted" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error accepting booking:", error);
    return { error: error.message };
  }

  // Notify owner that booking was accepted
  if (bookingDetails) {
    await createNotification({
      userId: bookingDetails.owner_id,
      type: "booking_accepted",
      title: "Κράτηση Εγκρίθηκε",
      message: "Ο φροντιστής αποδέχτηκε την κράτησή σου!",
      link: `/bookings/${bookingId}`,
    });
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

  const caregiverProfile =
    booking && booking.caregiver_profiles
      ? ((Array.isArray(booking.caregiver_profiles)
          ? booking.caregiver_profiles[0]
          : booking.caregiver_profiles) as { user_id: string })
      : null;

  if (!booking || !caregiverProfile || caregiverProfile.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Get booking details with owner info
  const { data: bookingDetails } = await supabase
    .from("bookings")
    .select("owner_id")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "declined" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error declining booking:", error);
    return { error: error.message };
  }

  // Notify owner that booking was declined
  if (bookingDetails) {
    await createNotification({
      userId: bookingDetails.owner_id,
      type: "booking_declined",
      title: "Κράτηση Απορρίφθηκε",
      message: "Ο φροντιστής απέρριψε την κράτησή σου.",
      link: `/bookings/${bookingId}`,
    });
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

  // Get booking details with caregiver info
  const { data: bookingDetails } = await supabase
    .from("bookings")
    .select("caregiver_profiles!inner(user_id)")
    .eq("id", bookingId)
    .eq("owner_id", user.id)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Error cancelling booking:", error);
    return { error: error.message };
  }

  // Notify caregiver that booking was cancelled
  if (bookingDetails && bookingDetails.caregiver_profiles) {
    const caregiverProfile = Array.isArray(bookingDetails.caregiver_profiles)
      ? bookingDetails.caregiver_profiles[0]
      : bookingDetails.caregiver_profiles;
    await createNotification({
      userId: (caregiverProfile as { user_id: string }).user_id,
      type: "booking_cancelled",
      title: "Κράτηση Ακυρώθηκε",
      message: "Ο ιδιοκτήτης ακύρωσε μια κράτηση.",
      link: `/bookings/${bookingId}`,
    });
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

  // Get booking details with both owner and caregiver info
  const { data: bookingDetails } = await supabase
    .from("bookings")
    .select("owner_id, caregiver_profiles!inner(user_id)")
    .eq("id", bookingId)
    .single();

  // Update booking status
  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error completing booking:", error);
    return { error: error.message };
  }

  // Notify both parties that booking was completed
  if (bookingDetails && bookingDetails.caregiver_profiles) {
    const caregiverProfile = Array.isArray(bookingDetails.caregiver_profiles)
      ? bookingDetails.caregiver_profiles[0]
      : bookingDetails.caregiver_profiles;
    const caregiverUserId = (caregiverProfile as { user_id: string }).user_id;

    // Notify owner
    await createNotification({
      userId: bookingDetails.owner_id,
      type: "booking_completed",
      title: "Κράτηση Ολοκληρώθηκε",
      message: "Η κράτησή σου ολοκληρώθηκε! Μπορείς να αφήσεις μια αξιολόγηση.",
      link: `/bookings/${bookingId}`,
    });

    // Notify caregiver
    await createNotification({
      userId: caregiverUserId,
      type: "booking_completed",
      title: "Κράτηση Ολοκληρώθηκε",
      message: "Μια κράτηση ολοκληρώθηκε επιτυχώς!",
      link: `/bookings/${bookingId}`,
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}
