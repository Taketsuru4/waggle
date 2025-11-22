import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "../auth/actions";
import { getConversations } from "@/lib/data/messages";
import { MessageCircle } from "lucide-react";

export default async function MessagesPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const conversations = await getConversations();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Πίσω
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Μηνύματα
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Οι συνομιλίες σου
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {conversations.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <MessageCircle className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Δεν έχεις μηνύματα ακόμα
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Τα μηνύματα από τις κρατήσεις σου θα εμφανιστούν εδώ
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Πήγαινε στο Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.booking_id}
                href={`/messages/${conversation.booking_id}`}
                className="block rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <MessageCircle className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                          {conversation.other_party_name || "Χρήστης"}
                        </h3>
                        {conversation.last_message && (
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {conversation.last_message && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
                            {new Date(
                              conversation.last_message.created_at,
                            ).toLocaleDateString("el-GR")}
                          </span>
                        )}
                        {conversation.unread_count > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
