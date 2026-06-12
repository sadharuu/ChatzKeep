"use client";

import { useState } from "react";

import Sidebar from "@/components/chat/Sidebar";
import TopNavbar from "@/components/chat/TopNavbar";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  // FIXED: Changed useState({null}) to useState(null) to fix the syntax token crash
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Chat Section */}
        <div className="flex flex-1 overflow-hidden">

          {/* Chat List */}
          <div className="w-[320px] bg-white border-r overflow-hidden">
            <ChatList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatWindow selectedUser={selectedUser} />
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