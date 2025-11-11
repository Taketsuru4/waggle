"use client";

import { markMessagesAsRead } from "@/app/messages/actions";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/data/messages";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface MessageThreadProps {
  bookingId: string;
  initialMessages: Message[];
  currentUserId: string;
}

export function MessageThread({
  bookingId,
  initialMessages,
  currentUserId,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mark messages as read when component mounts
  useEffect(() => {
    markMessagesAsRead(bookingId);
  }, [bookingId]);

  // Set up Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    // Create channel for this booking
    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        async (payload) => {
          // Fetch the sender info for the new message
          const { data: senderData } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          if (senderData) {
            const newMessage: Message = {
              ...payload.new,
              sender: senderData,
            } as Message;

            setMessages((prev) => [...prev, newMessage]);

            // Mark as read if it's not from current user
            if (payload.new.sender_id !== currentUserId) {
              await markMessagesAsRead(bookingId);
            }

            // Scroll to bottom after new message
            setTimeout(scrollToBottom, 100);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          // Update message read status
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id
                ? { ...msg, read: payload.new.read }
                : msg,
            ),
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [bookingId, currentUserId]);

  // Scroll to bottom on initial render and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSent = () => {
    // Scroll to bottom after sending a message
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Δεν υπάρχουν μηνύματα ακόμα
              </p>
              <p className="text-sm">
                Στείλτε το πρώτο μήνυμα για να ξεκινήσετε τη συνομιλία
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input container */}
      <MessageInput bookingId={bookingId} onMessageSent={handleMessageSent} />
    </div>
  );
}
