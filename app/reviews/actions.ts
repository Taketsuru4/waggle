"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const bookingId = formData.get("booking_id") as string;
  const rating = Number.parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return { error: "Η αξιολόγηση πρέπει να είναι από 1 έως 5 αστέρια" };
  }

  // Verify booking exists and user is the owner
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, owner_id, caregiver_id, status")
    .eq("id", bookingId)
    .eq("owner_id", user.id)
    .single();

  if (bookingError || !booking) {
    return { error: "Η κράτηση δεν βρέθηκε ή δεν έχετε δικαίωμα πρόσβασης" };
  }

  // Check if booking is completed
  if (booking.status !== "completed") {
    return {
      error: "Μπορείτε να αξιολογήσετε μόνο ολοκληρωμένες κρατήσεις",
    };
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .single();

  if (existingReview) {
    return { error: "Έχετε ήδη αξιολογήσει αυτή την κράτηση" };
  }

  // Create review
  const { error } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    caregiver_id: booking.caregiver_id,
    reviewer_id: user.id,
    rating: rating,
    comment: comment || null,
  });

  if (error) {
    console.error("Error creating review:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/caregivers/${booking.caregiver_id}`);
  return { success: true };
}

export async function checkExistingReview(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { exists: false };
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("booking_id", bookingId)
    .eq("reviewer_id", user.id)
    .single();

  return {
    exists: !!review,
    review: review || null,
  };
}

export async function canReviewBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { canReview: false, reason: "Unauthorized" };
  }

  // Check if booking exists and is completed
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, owner_id, status")
    .eq("id", bookingId)
    .eq("owner_id", user.id)
    .single();

  if (!booking) {
    return { canReview: false, reason: "Booking not found or no access" };
  }

  if (booking.status !== "completed") {
    return { canReview: false, reason: "Booking not completed" };
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .single();

  if (existingReview) {
    return { canReview: false, reason: "Already reviewed" };
  }

  return { canReview: true };
}

export async function updateReview(reviewId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const rating = Number.parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return { error: "Η αξιολόγηση πρέπει να είναι από 1 έως 5 αστέρια" };
  }

  // Verify review exists and user is the reviewer
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, reviewer_id, caregiver_id")
    .eq("id", reviewId)
    .eq("reviewer_id", user.id)
    .single();

  if (reviewError || !review) {
    return { error: "Η αξιολόγηση δεν βρέθηκε ή δεν έχετε δικαίωμα πρόσβασης" };
  }

  // Update review
  const { error } = await supabase
    .from("reviews")
    .update({
      rating: rating,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("reviewer_id", user.id); // Extra security check

  if (error) {
    console.error("Error updating review:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/caregivers/${review.caregiver_id}`);
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify review exists and user is the reviewer
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, reviewer_id, caregiver_id")
    .eq("id", reviewId)
    .eq("reviewer_id", user.id)
    .single();

  if (reviewError || !review) {
    return { error: "Η αξιολόγηση δεν βρέθηκε ή δεν έχετε δικαίωμα πρόσβασης" };
  }

  // Delete review
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("reviewer_id", user.id); // Extra security check

  if (error) {
    console.error("Error deleting review:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/caregivers/${review.caregiver_id}`);
  return { success: true };
}
