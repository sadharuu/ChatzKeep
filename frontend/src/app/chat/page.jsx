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
  
  // Dynamic persistent storage for the last text snippet of each contact
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

  // Listen to active socket message pipelines
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      if (!message) return;

      // Extract the plain text content safely across common backend field names
      const textSnippet = message.text || message.content || message.message || message.body;
      const senderId = message.sender?._id || message.sender || message.senderId;

      if (senderId && textSnippet) {
        setLastMessagesMap((prev) => ({
          ...prev,
          [senderId]: textSnippet,
        }));
      }
      fetchUsers();
    };

    // Subscribing to all possible incoming event hooks
    socket.on("message received", handleIncomingMessage);
    socket.on("newMessage", handleIncomingMessage);
    socket.on("msg-receive", handleIncomingMessage);

    return () => {
      socket.off("message received", handleIncomingMessage);
      socket.off("newMessage", handleIncomingMessage);
      socket.off("msg-receive", handleIncomingMessage);
    };
  }, [socket]);

  // Intercept your own sent messages from the text input bar
  const handleLocalMessageSent = (messagePayload) => {
    if (selectedUser?._id && messagePayload) {
      // Pull plain text strings out safely from what your input box returns
      const userTextMessage = 
        typeof messagePayload === "string" 
          ? messagePayload 
          : (messagePayload.text || messagePayload.content || messagePayload.message || "Sent a message");

      setLastMessagesMap((prev) => ({
        ...prev,
        [selectedUser._id]: userTextMessage,
      }));
    }
    fetchUsers();
  };

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
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