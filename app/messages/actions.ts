"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MessageActionResult =
  | { success: true; data?: unknown }
  | { success: false; error: string };

/**
 * Send a message in a booking conversation
 */
export async function sendMessage(
  bookingId: string,
  content: string,
): Promise<MessageActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Πρέπει να είστε συνδεδεμένοι" };
    }

    // Validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "Το μήνυμα δεν μπορεί να είναι κενό" };
    }

    if (trimmedContent.length > 1000) {
      return {
        success: false,
        error: "Το μήνυμα δεν μπορεί να υπερβαίνει τους 1000 χαρακτήρες",
      };
    }

    // Verify user is participant in this booking
    // Check if user is owner
    const { data: ownerCheck } = await supabase
      .from("bookings")
      .select("id, owner_id")
      .eq("id", bookingId)
      .eq("owner_id", user.id)
      .single();

    // Check if user is caregiver
    const { data: caregiverCheck } = await supabase
      .from("bookings")
      .select("id, caregiver_profiles!inner(user_id)")
      .eq("id", bookingId)
      .eq("caregiver_profiles.user_id", user.id)
      .single();

    if (!ownerCheck && !caregiverCheck) {
      return {
        success: false,
        error: "Δεν έχετε δικαίωμα να στείλετε μηνύματα σε αυτή την κράτηση",
      };
    }

    // Insert message
    const { error: insertError } = await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: user.id,
      content: trimmedContent,
    });

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return { success: false, error: "Αποτυχία αποστολής μηνύματος" };
    }

    // Revalidate the messages page
    revalidatePath(`/messages/${bookingId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return { success: false, error: "Παρουσιάστηκε σφάλμα" };
  }
}

/**
 * Mark messages as read for the current user in a booking
 */
export async function markMessagesAsRead(
  bookingId: string,
): Promise<MessageActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Πρέπει να είστε συνδεδεμένοι" };
    }

    // Update all unread messages in this booking that were NOT sent by the current user
    const { error: updateError } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("booking_id", bookingId)
      .eq("read", false)
      .neq("sender_id", user.id);

    if (updateError) {
      console.error("Error marking messages as read:", updateError);
      return { success: false, error: "Αποτυχία ενημέρωσης μηνυμάτων" };
    }

    // Revalidate pages
    revalidatePath(`/messages/${bookingId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return { success: false, error: "Παρουσιάστηκε σφάλμα" };
  }
}
