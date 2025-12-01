"use server";

import { resend } from "./client";
import { WelcomeEmail } from "./templates/welcome";
import { BookingRequestEmail } from "./templates/booking-request";
import { BookingAcceptedEmail } from "./templates/booking-accepted";
import { BookingDeclinedEmail } from "./templates/booking-declined";
import { BookingCancelledEmail } from "./templates/booking-cancelled";
import { BookingCompletedEmail } from "./templates/booking-completed";
import { NewReviewEmail } from "./templates/new-review";
import type {
  WelcomeEmailData,
  BookingEmailData,
  ReviewEmailData,
} from "./types";

const FROM_EMAIL = "Waggle <onboarding@resend.dev>"; // Update to your verified domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Helper function to send emails with error handling
 */
async function sendEmail(
  to: string,
  subject: string,
  react: React.ReactElement,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    data.userEmail,
    "Καλώς ήρθες στο Waggle! 🐾",
    WelcomeEmail(data),
  );
}

/**
 * Send booking request notification to caregiver
 */
export async function sendBookingRequestEmail(
  caregiverEmail: string,
  data: BookingEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    caregiverEmail,
    "Νέα αίτηση κράτησης στο Waggle",
    BookingRequestEmail(data),
  );
}

/**
 * Send booking accepted notification to owner
 */
export async function sendBookingAcceptedEmail(
  ownerEmail: string,
  data: BookingEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    ownerEmail,
    "Η κράτησή σου έγινε δεκτή! ✅",
    BookingAcceptedEmail(data),
  );
}

/**
 * Send booking declined notification to owner
 */
export async function sendBookingDeclinedEmail(
  ownerEmail: string,
  data: BookingEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    ownerEmail,
    "Ενημέρωση για την κράτησή σου",
    BookingDeclinedEmail(data),
  );
}

/**
 * Send booking cancelled notification to caregiver
 */
export async function sendBookingCancelledEmail(
  caregiverEmail: string,
  data: BookingEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    caregiverEmail,
    "Κράτηση ακυρώθηκε",
    BookingCancelledEmail(data),
  );
}

/**
 * Send booking completed notification to owner
 */
export async function sendBookingCompletedEmail(
  ownerEmail: string,
  data: BookingEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    ownerEmail,
    "Η κράτησή σου ολοκληρώθηκε! 🎉",
    BookingCompletedEmail(data),
  );
}

/**
 * Send new review notification to caregiver
 */
export async function sendNewReviewEmail(
  caregiverEmail: string,
  data: ReviewEmailData,
): Promise<{ success: boolean; error?: string }> {
  return sendEmail(
    caregiverEmail,
    "Έλαβες νέα κριτική! ⭐",
    NewReviewEmail(data),
  );
}
