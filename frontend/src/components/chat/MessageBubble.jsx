"use client";

import Image from "next/image";

export default function MessageBubble({ message, isMe }) {
  // Helper function to check if the fileUrl points to an image
  const isImageFile = (url) => {
    if (!url) return false;
    // Clean query parameters if any exist, then check common image extensions
    const cleanUrl = url.split("?")[0].toLowerCase();
    return (
      cleanUrl.endsWith(".jpg") ||
      cleanUrl.endsWith(".jpeg") ||
      cleanUrl.endsWith(".png") ||
      cleanUrl.endsWith(".gif") ||
      cleanUrl.endsWith(".webp")
    );
  };

  const hasFile = !!message.fileUrl;
  const isImg = hasFile && isImageFile(message.fileUrl);

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs border transition-all duration-200
          ${
            isMe
              ? "bg-[#2A836D] text-white border-[#2A836D] rounded-br-none"
              : "bg-white text-gray-800 border-gray-100 rounded-bl-none"
          }
          ${isImg ? "p-1 bg-transparent border-none shadow-none" : ""} 
        `}
      >
        {/* CASE 1: File is an Image -> Render it directly in the chat layout */}
        {isImg ? (
          <div className="relative max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-100 group">
            <img
              src={message.fileUrl}
              alt={message.fileName || "Sent image"}
              className="max-h-60 w-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            {/* Optional overlay tag displaying filename on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition truncate">
              {message.fileName || "image.jpg"}
            </div>
          </div>
        ) : hasFile ? (
          /* CASE 2: File is NOT an image (PDF, Doc, Zip, etc.) -> Leave as fallback attachment link */
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="underline font-medium break-all flex items-center gap-1.5 hover:opacity-90"
          >
            📎 {message.fileName || "View Attachment"}
          </a>
        ) : (
          /* CASE 3: Standard Text Message */
          <p className="break-words whitespace-pre-wrap leading-relaxed">
            {message.text}
          </p>
        )}

        {/* Timestamp */}
        {message.createdAt && (
          <span
            className={`text-[10px] block mt-1 text-right tracking-tight opacity-75 select-none
              ${isMe ? "text-emerald-100" : "text-gray-400"}
              ${isImg ? "text-gray-500 font-medium text-left px-1 mt-1" : ""}
            `}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}