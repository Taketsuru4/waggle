"use client";

import { sendMessage } from "@/app/messages/actions";
import { useState } from "react";
import { toast } from "sonner";

interface MessageInputProps {
  bookingId: string;
  onMessageSent?: () => void;
}

export function MessageInput({ bookingId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendMessage(bookingId, content);

      if (result.success) {
        setContent("");
        onMessageSent?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Αποτυχία αποστολής μηνύματος");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, new line on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 bg-white"
    >
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Γράψτε ένα μήνυμα..."
          disabled={isSubmitting}
          rows={1}
          maxLength={1000}
          className="flex-1 resize-none rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: "40px",
            maxHeight: "120px",
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex-shrink-0 bg-purple-600 text-white rounded-full px-6 py-2 font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
        >
          {isSubmitting ? "Αποστολή..." : "Αποστολή"}
        </button>
      </div>
      <div className="mt-1 text-right">
        <span
          className={`text-xs ${content.length > 900 ? "text-red-500" : "text-gray-400"}`}
        >
          {content.length}/1000
        </span>
      </div>
    </form>
  );
}
