"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/chat/Sidebar";
import TopNavbar from "@/components/chat/TopNavbar";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import api from "@/services/api";
import { useSocket } from "@/context/SocketContext";

export default function ChatPage() {
  const socket = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      // We hit the exact route you use to load the sidebar list.
      // If your ChatList component uses a different route (e.g., "/user/all" or "/chat/users"), change this URL to match it!
      const res = await api.get("/chat/conversations");
      const data = Array.isArray(res.data) ? res.data : (res.data.conversations || []);
      setConversations(data);
    } catch (error) {
      console.log("Error loading conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for live messages to refresh the list state automatically
  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => fetchConversations();
    
    socket.on("message received", handleRefresh);
    socket.on("newMessage", handleRefresh);
    return () => {
      socket.off("message received", handleRefresh);
      socket.off("newMessage", handleRefresh);
    };
  }, [socket]);

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Pass conversations down to the TopNavbar */}
        <TopNavbar conversations={conversations} refreshConversations={fetchConversations} />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] bg-white border-r overflow-hidden">
            {/* Pass conversations down to the ChatList or let it use its internal fetch */}
            <ChatList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              conversations={conversations} 
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatWindow selectedUser={selectedUser} onMessageSent={fetchConversations} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-custom text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}