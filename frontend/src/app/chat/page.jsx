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
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      // Hits the verified working endpoint from your ChatList component
      const res = await api.get("/user/all");
      const fetchedUsers = res.data?.users || [];
      setUsers(fetchedUsers);
      
      // Keep the default selection behavior safe
      if (fetchedUsers.length > 0 && !selectedUser) {
        setSelectedUser(fetchedUsers[0]);
      }
    } catch (error) {
      console.log("Failed to load users layout data: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Real-time socket framework integration
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      // Whenever a message arrives, we update our user metrics
      fetchUsers();
    };

    socket.on("message received", handleIncomingMessage);
    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("message received", handleIncomingMessage);
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [socket, selectedUser]);

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Pass the verified users down to the TopNavbar */}
        <TopNavbar 
          users={users} 
          selectedUser={selectedUser} 
          refreshUsers={fetchUsers} 
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] bg-white border-r overflow-hidden">
            {/* Pass state and handlers directly down */}
            <ChatList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              users={users}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatWindow selectedUser={selectedUser} onMessageSent={fetchUsers} />
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