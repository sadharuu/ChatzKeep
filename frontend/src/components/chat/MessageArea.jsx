"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageArea({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  // Automatically scrolls the conversation to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafafa] flex flex-col h-full">

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          No messages yet
        </div>
      ) : (
        messages.map((message) => {
          // Compare message sender with current user ID to determine orientation
          // Safely checks if sender is a plain string ID or a populated object
          const isMe = 
            message.sender === currentUserId || 
            message.sender?._id === currentUserId;

          return (
            <MessageBubble
              key={message._id || message.id}
              message={message}
              isMe={isMe} // Pass the boolean flag down to the bubble component
            />
          );
        })
      )}

      {/* Invisible anchor tag used to handle automatic bottom pinned view matching */}
      <div ref={messagesEndRef} />

    </div>
  );
}