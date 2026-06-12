"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import api from "@/services/api";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [lastMessagesMap, setLastMessagesMap] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // Load profile credentials seamlessly from persistent storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await api.get("/user/all");
      const fetchedUsers = res.data?.users || [];
      setUsers(fetchedUsers);
    } catch (error) {
      console.log("Failed to load layout sync lists: ", error);
    }
  };

  const fetchLastMessageFromHistory = async (targetUserId) => {
    if (!currentUser?._id || !targetUserId) return;
    try {
      const res = await api.get(`/message/${currentUser._id}/${targetUserId}`);
      const historyMessages = res.data?.messages || [];
      if (historyMessages.length > 0) {
        const latestMsg = historyMessages[historyMessages.length - 1];
        const textSnippet = latestMsg.text || (latestMsg.file ? "Sent a file attachment" : "");
        if (textSnippet) {
          setLastMessagesMap((prev) => ({ ...prev, [targetUserId]: textSnippet }));
        }
      }
    } catch (error) {
      console.log(`Error reading workspace history for ${targetUserId}:`, error);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, [currentUser]);

  useEffect(() => {
    if (users.length > 0 && currentUser?._id) {
      users.forEach((u) => {
        if (u?._id) fetchLastMessageFromHistory(u._id);
      });
    }
  }, [users, currentUser]);

  // Persistent Background Socket Engine
  useEffect(() => {
    if (!socket) return;

    const handleSocketIncoming = (newMessage) => {
      if (!newMessage) return;
      const senderId = newMessage.sender?._id || newMessage.sender;
      const textSnippet = newMessage.text || (newMessage.file ? "Sent a file attachment" : "New message");

      if (senderId) {
        setLastMessagesMap((prev) => ({ ...prev, [senderId]: textSnippet }));
      }
      refreshUsers();
    };

    socket.on("receiveMessage", handleSocketIncoming);
    return () => {
      socket.off("receiveMessage", handleSocketIncoming);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ users, lastMessagesMap, refreshUsers, setLastMessagesMap, fetchLastMessageFromHistory }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);