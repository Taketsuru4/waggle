import { createClient } from "@/lib/supabase/server";

export async function getAllCaregivers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("caregiver_profiles")
    .select(`
			*,
			profiles:user_id (
				full_name,
				email
			)
		`)
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching caregivers:", error);
    return [];
  }

  return data || [];
}

export async function getCaregiverById(caregiverId: string) {
  const supabase = await createClient();

  const { data: caregiver, error } = await supabase
    .from("caregiver_profiles")
    .select(`
			*,
			profiles:user_id (
				full_name,
				email,
				phone,
				avatar_url
			)
		`)
    .eq("id", caregiverId)
    .single();

  if (error) {
    console.error("Error fetching caregiver:", error);
    return null;
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
			*,
			profiles:reviewer_id (
				full_name
			)
		`)
    .eq("caregiver_id", caregiverId)
    .order("created_at", { ascending: false });

  // Calculate stats
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("caregiver_id", caregiverId)
    .eq("status", "completed");

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    ...caregiver,
    reviews: reviews || [],
    stats: {
      totalBookings: totalBookings || 0,
      averageRating: avgRating,
      totalReviews: reviews?.length || 0,
    },
  };
}

export async function searchCaregivers(filters: {
  search?: string;
  city?: string;
  petType?: string;
  minRate?: number;
  maxRate?: number;
  onlyAvailable?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase.from("caregiver_profiles").select(`
			*,
			profiles:user_id (
				full_name,
				email
			)
		`);

  // Filter by availability (default to true)
  if (filters.onlyAvailable !== false) {
    query = query.eq("available", true);
  }

  // Text search on city or bio
  if (filters.search) {
    query = query.or(
      `city.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`,
    );
  }

  // Filter by city
  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  // Filter by pet type
  if (filters.petType) {
    switch (filters.petType) {
      case "dog":
        query = query.eq("accepts_dogs", true);
        break;
      case "cat":
        query = query.eq("accepts_cats", true);
        break;
      case "bird":
        query = query.eq("accepts_birds", true);
        break;
      case "rabbit":
        query = query.eq("accepts_rabbits", true);
        break;
      case "other":
        query = query.eq("accepts_other", true);
        break;
    }
  }

  // Filter by price range
  if (filters.minRate !== undefined) {
    query = query.gte("hourly_rate", filters.minRate);
  }
  if (filters.maxRate !== undefined) {
    query = query.lte("hourly_rate", filters.maxRate);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching caregivers:", error);
    return [];
  }

  return data || [];
}
