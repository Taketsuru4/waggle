import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

/**
 * Get all messages for a booking conversation
 */
export async function getConversation(
  bookingId: string,
): Promise<Message[] | null> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Verify user is participant in this booking
    const { data: ownerCheck } = await supabase
      .from("bookings")
      .select("id")
      .eq("id", bookingId)
      .eq("owner_id", user.id)
      .single();

    const { data: caregiverCheck } = await supabase
      .from("bookings")
      .select("id, caregiver_profiles!inner(user_id)")
      .eq("id", bookingId)
      .eq("caregiver_profiles.user_id", user.id)
      .single();

    if (!ownerCheck && !caregiverCheck) {
      return null;
    }

    // Fetch messages with sender info
    const { data: messages, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return null;
    }

    return messages as Message[];
  } catch (error) {
    console.error("Error in getConversation:", error);
    return null;
  }
}

/**
 * Get unread message count for a booking
 */
export async function getUnreadCount(bookingId: string): Promise<number> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return 0;
    }

    // Count unread messages NOT sent by current user
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("booking_id", bookingId)
      .eq("read", false)
      .neq("sender_id", user.id);

    if (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return 0;
  }
}

/**
 * Get total unread message count across all bookings for current user
 */
export async function getTotalUnreadCount(): Promise<number> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return 0;
    }

    // Get all booking IDs where user is participant
    const { data: ownerBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("owner_id", user.id);

    const { data: caregiverBookings } = await supabase
      .from("bookings")
      .select("id, caregiver_profiles!inner(user_id)")
      .eq("caregiver_profiles.user_id", user.id);

    const bookingIds = [
      ...(ownerBookings || []).map((b) => b.id),
      ...(caregiverBookings || []).map((b) => b.id),
    ];

    if (bookingIds.length === 0) {
      return 0;
    }

    // Count unread messages in these bookings NOT sent by current user
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("booking_id", bookingIds)
      .eq("read", false)
      .neq("sender_id", user.id);

    if (error) {
      console.error("Error fetching total unread count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getTotalUnreadCount:", error);
    return 0;
  }
}
