"use client";

import { useState, useEffect, useRef } from "react";
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
  const [lastMessagesMap, setLastMessagesMap] = useState({});

  // Get the logged-in user profile safely from local state variables
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

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

  // Fetch the latest message snippet from your verified endpoint
  const fetchLastMessageFromHistory = async (targetUserId) => {
    if (!currentUser?._id || !targetUserId) return;
    try {
      const res = await api.get(`/message/${currentUser._id}/${targetUserId}`);
      const historyMessages = res.data?.messages || [];
      
      if (historyMessages.length > 0) {
        const latestMsg = historyMessages[historyMessages.length - 1];
        // Parse strings or attachment fallbacks safely
        const textSnippet = latestMsg.text || (latestMsg.file ? "Sent a file attachment" : "");
        
        if (textSnippet) {
          setLastMessagesMap((prev) => ({
            ...prev,
            [targetUserId]: textSnippet,
          }));
        }
      }
    } catch (error) {
      console.log(`Could not load message snapshots for user ${targetUserId}:`, error);
    }
  };

  // Initial data loading once profile information is found
  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  // Read message logs once user list is ready
  useEffect(() => {
    if (users.length > 0 && currentUser?._id) {
      users.forEach((u) => {
        if (u?._id) fetchLastMessageFromHistory(u._id);
      });
    }
  }, [users, currentUser]);

  // Catching inbound message notifications over socket
  useEffect(() => {
    if (!socket) return;

    const handleSocketIncoming = (newMessage) => {
      if (!newMessage) return;

      // Extract the sender id matching the properties used by your ChatWindow component
      const senderId = newMessage.sender?._id || newMessage.sender;
      const textSnippet = newMessage.text || (newMessage.file ? "Sent a file attachment" : "New message");

      if (senderId) {
        setLastMessagesMap((prev) => ({
          ...prev,
          [senderId]: textSnippet,
        }));
      }
      
      // Keep online user structures up-to-date
      fetchUsers();
    };

    socket.on("receiveMessage", handleSocketIncoming);

    return () => {
      socket.off("receiveMessage", handleSocketIncoming);
    };
  }, [socket]);

  // Handler to capture messages sent by you from the current screen workspace
  const handleLocalUpdate = () => {
    fetchUsers();
    if (selectedUser?._id) {
      fetchLastMessageFromHistory(selectedUser._id);
    }
  };

  return (
    <div className="h-screen bg-[#F8F9FA] font-custom flex overflow-hidden">
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
              <ChatWindow 
                selectedUser={selectedUser} 
                key={selectedUser._id}
                onMessageSent={handleLocalUpdate} // Keeps synchronization fluid
              />
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