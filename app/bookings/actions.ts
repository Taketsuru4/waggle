"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "@/lib/data/notifications";
import {
  sendBookingRequestEmail,
  sendBookingAcceptedEmail,
  sendBookingDeclinedEmail,
  sendBookingCancelledEmail,
  sendBookingCompletedEmail,
} from "@/lib/email/send";
import { format } from "date-fns";
import { el } from "date-fns/locale";

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
    const caregiverUserId = (caregiverProfile as { user_id: string }).user_id;

    await createNotification({
      userId: caregiverUserId,
      type: "booking_request",
      title: "Νέο Αίτημα Κράτησης",
      message: "Έλαβες ένα νέο αίτημα κράτησης από έναν ιδιοκτήτη.",
      link: `/bookings/${newBooking.id}`,
    });

    // Send email notification
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        end_date,
        pets(name),
        profiles!bookings_owner_id_fkey(full_name, email),
        caregiver_profiles!inner(
          profiles(full_name, email)
        )
      `)
      .eq("id", newBooking.id)
      .single();

    if (bookingData) {
      const ownerProfiles = bookingData.profiles;
      const ownerProfile = (Array.isArray(ownerProfiles)
        ? ownerProfiles[0]
        : ownerProfiles) as { full_name: string; email: string } | null;
      const caregiverProfiles = bookingData.caregiver_profiles;
      const caregiverProfileData = Array.isArray(caregiverProfiles)
        ? caregiverProfiles[0]
        : caregiverProfiles;
      // Type assertion for nested profiles structure
      const caregiverProfile =
        caregiverProfileData as unknown as {
          profiles:
            | { email: string; full_name: string }
            | { email: string; full_name: string }[];
        } | null;
      const caregiverProfilesNested = caregiverProfile?.profiles;
      const caregiverProfileInner = Array.isArray(caregiverProfilesNested)
        ? caregiverProfilesNested[0]
        : caregiverProfilesNested;
      const caregiverEmail = caregiverProfileInner?.email || null;
      const caregiverName = caregiverProfileInner?.full_name || null;
      const petsData = bookingData.pets;
      const petData = (Array.isArray(petsData) ? petsData[0] : petsData) as
        | { name: string }
        | null;

      if (caregiverEmail && ownerProfile && petData) {
        sendBookingRequestEmail(caregiverEmail, {
          ownerName: ownerProfile.full_name || "Ιδιοκτήτης",
          caregiverName: caregiverName || "Caregiver",
          petName: petData.name,
          startDate: format(new Date(bookingData.start_date), "d MMM yyyy", {
            locale: el,
          }),
          endDate: format(new Date(bookingData.end_date), "d MMM yyyy", {
            locale: el,
          }),
          bookingId: bookingData.id,
          bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/bookings/${bookingData.id}`,
        }).catch((error) => {
          console.error("Failed to send booking request email:", error);
        });
      }
    }
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

    // Send email notification
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        end_date,
        pets(name),
        profiles!bookings_owner_id_fkey(full_name, email),
        caregiver_profiles!inner(
          profiles(full_name)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (bookingData) {
      const ownerProfiles = bookingData.profiles;
      const ownerProfile = (Array.isArray(ownerProfiles)
        ? ownerProfiles[0]
        : ownerProfiles) as { full_name: string; email: string } | null;
      const caregiverProfiles = bookingData.caregiver_profiles;
      const caregiverProfileData = Array.isArray(caregiverProfiles)
        ? caregiverProfiles[0]
        : caregiverProfiles;
      const caregiverProfile =
        caregiverProfileData as unknown as {
          profiles: { full_name: string } | { full_name: string }[];
        } | null;
      const caregiverProfilesNested = caregiverProfile?.profiles;
      const caregiverProfileInner = Array.isArray(caregiverProfilesNested)
        ? caregiverProfilesNested[0]
        : caregiverProfilesNested;
      const caregiverName = caregiverProfileInner?.full_name || null;
      const petsData = bookingData.pets;
      const petData = (Array.isArray(petsData) ? petsData[0] : petsData) as
        | { name: string }
        | null;

      if (ownerProfile?.email && petData) {
        sendBookingAcceptedEmail(ownerProfile.email, {
          ownerName: ownerProfile.full_name || "Ιδιοκτήτης",
          caregiverName: caregiverName || "Caregiver",
          petName: petData.name,
          startDate: format(new Date(bookingData.start_date), "d MMM yyyy", {
            locale: el,
          }),
          endDate: format(new Date(bookingData.end_date), "d MMM yyyy", {
            locale: el,
          }),
          bookingId: bookingData.id,
          bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/bookings/${bookingData.id}`,
        }).catch((error) => {
          console.error("Failed to send booking accepted email:", error);
        });
      }
    }
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

    // Send email notification
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        end_date,
        pets(name),
        profiles!bookings_owner_id_fkey(full_name, email),
        caregiver_profiles!inner(
          profiles(full_name)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (bookingData) {
      const ownerProfiles = bookingData.profiles;
      const ownerProfile = (Array.isArray(ownerProfiles)
        ? ownerProfiles[0]
        : ownerProfiles) as { full_name: string; email: string } | null;
      const caregiverProfiles = bookingData.caregiver_profiles;
      const caregiverProfileData = Array.isArray(caregiverProfiles)
        ? caregiverProfiles[0]
        : caregiverProfiles;
      const caregiverProfile =
        caregiverProfileData as unknown as {
          profiles: { full_name: string } | { full_name: string }[];
        } | null;
      const caregiverProfilesNested = caregiverProfile?.profiles;
      const caregiverProfileInner = Array.isArray(caregiverProfilesNested)
        ? caregiverProfilesNested[0]
        : caregiverProfilesNested;
      const caregiverName = caregiverProfileInner?.full_name || null;
      const petsData = bookingData.pets;
      const petData = (Array.isArray(petsData) ? petsData[0] : petsData) as
        | { name: string }
        | null;

      if (ownerProfile?.email && petData) {
        sendBookingDeclinedEmail(ownerProfile.email, {
          ownerName: ownerProfile.full_name || "Ιδιοκτήτης",
          caregiverName: caregiverName || "Caregiver",
          petName: petData.name,
          startDate: format(new Date(bookingData.start_date), "d MMM yyyy", {
            locale: el,
          }),
          endDate: format(new Date(bookingData.end_date), "d MMM yyyy", {
            locale: el,
          }),
          bookingId: bookingData.id,
          bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/bookings/${bookingData.id}`,
        }).catch((error) => {
          console.error("Failed to send booking declined email:", error);
        });
      }
    }
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

    // Send email notification
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        end_date,
        pets(name),
        profiles!bookings_owner_id_fkey(full_name),
        caregiver_profiles!inner(
          profiles(full_name, email)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (bookingData) {
      const ownerProfiles = bookingData.profiles;
      const ownerProfile = (Array.isArray(ownerProfiles)
        ? ownerProfiles[0]
        : ownerProfiles) as { full_name: string } | null;
      const caregiverProfiles = bookingData.caregiver_profiles;
      const caregiverProfileData = Array.isArray(caregiverProfiles)
        ? caregiverProfiles[0]
        : caregiverProfiles;
      const caregiverProfile =
        caregiverProfileData as unknown as {
          profiles:
            | { email: string; full_name: string }
            | { email: string; full_name: string }[];
        } | null;
      const caregiverProfilesNested = caregiverProfile?.profiles;
      const caregiverProfileInner = Array.isArray(caregiverProfilesNested)
        ? caregiverProfilesNested[0]
        : caregiverProfilesNested;
      const caregiverEmail = caregiverProfileInner?.email || null;
      const caregiverName = caregiverProfileInner?.full_name || null;
      const petsData = bookingData.pets;
      const petData = (Array.isArray(petsData) ? petsData[0] : petsData) as
        | { name: string }
        | null;

      if (caregiverEmail && petData) {
        sendBookingCancelledEmail(caregiverEmail, {
          ownerName: ownerProfile?.full_name || "Ιδιοκτήτης",
          caregiverName: caregiverName || "Caregiver",
          petName: petData.name,
          startDate: format(new Date(bookingData.start_date), "d MMM yyyy", {
            locale: el,
          }),
          endDate: format(new Date(bookingData.end_date), "d MMM yyyy", {
            locale: el,
          }),
          bookingId: bookingData.id,
          bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/bookings/${bookingData.id}`,
        }).catch((error) => {
          console.error("Failed to send booking cancelled email:", error);
        });
      }
    }
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

    // Send email notification to owner
    const { data: bookingData } = await supabase
      .from("bookings")
      .select(`
        id,
        pets(name),
        profiles!bookings_owner_id_fkey(full_name, email),
        caregiver_profiles!inner(
          profiles(full_name)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (bookingData) {
      const ownerProfiles = bookingData.profiles;
      const ownerProfile = (Array.isArray(ownerProfiles)
        ? ownerProfiles[0]
        : ownerProfiles) as { full_name: string; email: string } | null;
      const caregiverProfiles = bookingData.caregiver_profiles;
      const caregiverProfileData = Array.isArray(caregiverProfiles)
        ? caregiverProfiles[0]
        : caregiverProfiles;
      const caregiverProfile =
        caregiverProfileData as unknown as {
          profiles: { full_name: string } | { full_name: string }[];
        } | null;
      const caregiverProfilesNested = caregiverProfile?.profiles;
      const caregiverProfileInner = Array.isArray(caregiverProfilesNested)
        ? caregiverProfilesNested[0]
        : caregiverProfilesNested;
      const caregiverName = caregiverProfileInner?.full_name || null;
      const petsData = bookingData.pets;
      const petData = (Array.isArray(petsData) ? petsData[0] : petsData) as
        | { name: string }
        | null;

      if (ownerProfile?.email && petData) {
        sendBookingCompletedEmail(ownerProfile.email, {
          ownerName: ownerProfile.full_name || "Ιδιοκτήτης",
          caregiverName: caregiverName || "Caregiver",
          petName: petData.name,
          startDate: "",
          endDate: "",
          bookingId: bookingData.id,
          bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/bookings/${bookingData.id}`,
        }).catch((error) => {
          console.error("Failed to send booking completed email:", error);
        });
      }
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}
