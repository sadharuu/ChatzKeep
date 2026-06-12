"use client";

import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageArea from "./MessageArea";
import MessageInput from "./MessageInput";

import api from "@/services/api";
import { useSocket } from "@/context/SocketContext";

export default function ChatWindow({ selectedUser }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  // Load conversation
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    fetchMessages();
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(
        `/message/${currentUser._id}/${selectedUser._id}`
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Socket Listener
  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receiveMessage", (newMessage) => {
      if (
        newMessage.sender === selectedUser._id ||
        newMessage.sender?._id === selectedUser._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, selectedUser]);

  // Find your handleSendMessage function and add the onMessageSent line at the end:
const handleSendMessage = async (text) => {
  try {
    const res = await api.post("/message/send", {
      sender: currentUser._id,
      receiver: selectedUser._id,
      text,
    });

    setMessages((prev) => [...prev, res.data.message]);

    socket.emit("sendMessage", {
      ...res.data.message,
      sender: currentUser._id,
      receiver: selectedUser._id,
    });

    // Add this to refresh the layout container
    if (onMessageSent) onMessageSent();
  } catch (error) {
    console.log(error);
  }
};

// Find your handleSendFile function and add the onMessageSent line at the end:
const handleSendFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("sender", currentUser._id);
    formData.append("receiver", selectedUser._id);
    formData.append("file", file);

    const res = await api.post("/message/send-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setMessages((prev) => [...prev, res.data.message]);

    socket.emit("sendMessage", {
      ...res.data.message,
      sender: currentUser._id,
      receiver: selectedUser._id,
    });

    // Add this to refresh the layout container
    if (onMessageSent) onMessageSent();
  } catch (error) {
    console.log(error);
  }
};

  // Safe fallback if selectedUser is missing
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#fafafa]">
        Select a conversation
      </div>
    );
  }

  return (
    /* h-full ensures that the viewport takes up 100% vertical size of its parent grid layout */
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] overflow-hidden">
      
      {/* Header component stays fixed at the top */}
      <ChatHeader selectedUser={selectedUser} />

      {/* FIXED CONTAINER:
        Wrapping MessageArea inside a growth-controlled viewport container 
        forces it to expand ("flex-1") to fill the screen, and prevents it 
        from shrinking ("min-h-0") when empty.
      */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <MessageArea
          messages={messages}
          currentUserId={currentUser?._id}
        />
      </div>

      {/* Input container is pinned smoothly to the absolute base floor line */}
      <div className="shrink-0 w-full bg-white">
        <MessageInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
        />
      </div>

    </div>
  );
}