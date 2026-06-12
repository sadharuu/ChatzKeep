"use client";

import { useState } from "react";
import Sidebar from "@/components/chat/Sidebar";
import TopNavbar from "@/components/chat/TopNavbar";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useNotifications } from "@/context/NotificationContext";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, refreshUsers, fetchLastMessageFromHistory } = useNotifications();

  const handleLocalUpdate = () => {
    refreshUsers();
    if (selectedUser?._id) {
      fetchLastMessageFromHistory(selectedUser._id);
    }
  };

  return (
    <div className="h-screen bg-[#F8F9FA] font-custom flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* No messy prop drilling required here anymore! */}
        <TopNavbar selectedUser={selectedUser} />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] bg-white border-r overflow-hidden">
            <ChatList selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users} />
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatWindow selectedUser={selectedUser} key={selectedUser._id} onMessageSent={handleLocalUpdate} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}