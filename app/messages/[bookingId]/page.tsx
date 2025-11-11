import { getConversation } from "@/lib/data/messages";
import { MessageThread } from "@/components/message-thread";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface MessagesPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { bookingId } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Get messages for this booking
  const messages = await getConversation(bookingId);

  if (!messages) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-red-900 mb-2">
              Δεν έχετε πρόσβαση
            </h1>
            <p className="text-red-700 mb-4">
              Δεν έχετε δικαίωμα να δείτε αυτή τη συνομιλία.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Επιστροφή στο Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get booking info
  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `
      *,
      pet:pets(name),
      caregiver:caregiver_profiles(
        user_id,
        profiles:profiles(full_name)
      )
    `,
    )
    .eq("id", bookingId)
    .single();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-purple-600 hover:text-purple-700 font-medium mb-4 inline-block"
          >
            ← Πίσω στο Dashboard
          </Link>
          {booking && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Μηνύματα Κράτησης
              </h1>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Κατοικίδιο:</span>{" "}
                  {booking.pet?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Φροντιστής:</span>{" "}
                  {booking.caregiver?.profiles?.full_name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Ημερομηνίες:</span>{" "}
                  {new Date(booking.start_date).toLocaleDateString("el-GR")} -{" "}
                  {new Date(booking.end_date).toLocaleDateString("el-GR")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Thread */}
        <MessageThread
          bookingId={bookingId}
          initialMessages={messages}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
