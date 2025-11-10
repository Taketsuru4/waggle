import { createClient } from "@/lib/supabase/server";

export async function getUserReviews(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      caregiver:caregiver_profiles!reviews_caregiver_id_fkey(
        *,
        profile:profiles(full_name, email)
      ),
      booking:bookings(id, start_date, end_date)
    `,
    )
    .eq("reviewer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }

  return data || [];
}
