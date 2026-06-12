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
  
  // State to hold the latest message text map for each user: { userId: "message text" }
  const [lastMessagesMap, setLastMessagesMap] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      const fetchedUsers = res.data?.users || [];
      setUsers(fetchedUsers);
      
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

  // Socket framework integration to catch the text of incoming/outgoing messages
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      if (!message) return;

      // Extract the sender ID and the message text based on your MERN backend schema
      const senderId = message.sender?._id || message.sender || message.senderId;
      const messageText = message.text || message.content || message.message || "Sent an attachment";

      if (senderId) {
        setLastMessagesMap((prev) => ({
          ...prev,
          [senderId]: messageText,
        }));
      }

      // Refresh layout data statuses safely
      fetchUsers();
    };

    socket.on("message received", handleIncomingMessage);
    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("message received", handleIncomingMessage);
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [socket]);

  // Callback function to capture messages typed and sent by YOU in the ChatWindow
  const handleLocalMessageSent = (newMessageData) => {
    if (selectedUser?._id && newMessageData) {
      const messageText = newMessageData.text || newMessageData.content || newMessageData.message || "Sent a message";
      setLastMessagesMap((prev) => ({
        ...prev,
        [selectedUser._id]: messageText,
      }));
    }
    fetchUsers();
  };

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Pass down the last messages map to the navbar */}
        <TopNavbar 
          users={users} 
          selectedUser={selectedUser} 
          refreshUsers={fetchUsers} 
          lastMessagesMap={lastMessagesMap}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[320px] bg-white border-r overflow-hidden">
            <ChatList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              users={users}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedUser ? (
              <ChatWindow selectedUser={selectedUser} onMessageSent={handleLocalMessageSent} />
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