"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import UploadButton from "./UploadButton";

export default function MessageInput({
  onSendMessage,
  onSendFile,
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(message.trim());

    setMessage("");
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    onSendFile(file);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 flex items-center gap-3">

      {/* Upload Button */}
      <UploadButton
        onFileSelect={handleFileSelect}
      />

      {/* Message Input */}
      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) =>
          e.key === "Enter" && handleSend()
        }
        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2A836D] focus:ring-1 focus:ring-[#2A836D]"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="bg-[#2A836D] text-white p-3 rounded-lg hover:bg-[#236d5a] transition"
      >
        <Send size={18} />
      </button>

    </div>
  );
}