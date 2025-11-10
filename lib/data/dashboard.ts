import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CaregiverProfile =
  Database["public"]["Tables"]["caregiver_profiles"]["Row"];
type Pet = Database["public"]["Tables"]["pets"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getCaregiverProfile(
  userId: string,
): Promise<CaregiverProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("caregiver_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // User might not have a caregiver profile yet
    return null;
  }

  return data;
}

export async function getUserPets(userId: string): Promise<Pet[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pets:", error);
    return [];
  }

  return data || [];
}

export async function getOwnerBookings(userId: string): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("owner_id", userId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching owner bookings:", error);
    return [];
  }

  return data || [];
}

export async function getCaregiverBookings(
  caregiverId: string,
): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("caregiver_id", caregiverId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching caregiver bookings:", error);
    return [];
  }

  return data || [];
}

export async function getCaregiverReviews(caregiverId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("caregiver_id", caregiverId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

export async function getCaregiverStats(caregiverId: string) {
  const supabase = await createClient();

  // Get total bookings
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("caregiver_id", caregiverId);

  // Get pending bookings
  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("caregiver_id", caregiverId)
    .eq("status", "pending");

  // Get average rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("caregiver_id", caregiverId);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    averageRating: avgRating,
    totalReviews: reviews?.length || 0,
  };
}

type BookingWithDetails = Booking & {
  pet: Pet | null;
  owner: Profile;
  caregiver: CaregiverProfile & {
    profile: Profile;
  };
};

export async function getBookingDetails(
  bookingId: string,
): Promise<BookingWithDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      pet:pets(*),
      owner:profiles!bookings_owner_id_fkey(*),
      caregiver:caregiver_profiles(*,
        profile:profiles(*)      
      )
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Error fetching booking details:", error);
    return null;
  }

  return data as BookingWithDetails;
}
