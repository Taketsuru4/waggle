import type { Message } from "@/lib/data/messages";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.sender.avatar_url ? (
            <img
              src={message.sender.avatar_url}
              alt={message.sender.full_name || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
              {(message.sender.full_name?.[0] || "U").toUpperCase()}
            </div>
          )}
        </div>

        {/* Message content */}
        <div
          className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
        >
          {/* Sender name (only show for other users) */}
          {!isCurrentUser && (
            <span className="text-xs text-gray-500 mb-1 px-3">
              {message.sender.full_name || "Χρήστης"}
            </span>
          )}

          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isCurrentUser
                ? "bg-purple-600 text-white rounded-tr-sm"
                : "bg-gray-100 text-gray-900 rounded-tl-sm"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-gray-400 mt-1 px-3">
            {formatDistanceToNow(new Date(message.created_at), {
              addSuffix: true,
              locale: el,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
