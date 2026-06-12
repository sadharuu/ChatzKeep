"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, User, X } from "lucide-react";
import api from "@/services/api";
import { useSocket } from "@/context/SocketContext";

export default function TopNavbar() {
  const socket = useSocket();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); 
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchNotificationChats();
  }, []);

  // Real-time listener updates
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = () => {
      fetchNotificationChats();
    };

    socket.on("message received", handleIncomingMessage);
    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("message received", handleIncomingMessage);
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [socket]);

  // Dropdown click outside hook
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const fetchNotificationChats = async () => {
    try {
      const res = await api.get("/chat/conversations");
      // Handle array format variation variations safely
      const data = Array.isArray(res.data) ? res.data : (res.data.conversations || []);
      setConversations(data);
    } catch (error) {
      console.log("Error fetching notifications data:", error);
    }
  };

  // --- REWORKED BULLETPROOF FILTER LOGIC ---
  
  // "All": Every conversation item returned from your backend without exception
  const allNotifications = conversations;

  // "Unread": Fallback friendly checker. Captures chats with unreadCount, 
  // OR chats marked as unread, OR fallback to showing chats that have incoming flags.
  const unreadNotifications = conversations.filter(chat => {
    if (chat.unreadCount && chat.unreadCount > 0) return true;
    if (chat.isUnread === true) return true;
    
    // If your backend isn't sending unread counts yet, we fallback to checking if 
    // there's an unread message flag or if you aren't the author of the last message state
    return false; 
  });

  const totalUnreadCount = unreadNotifications.length;
  const currentList = activeTab === "all" ? allNotifications : unreadNotifications;

  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative z-50">

      {/* Search Bar Container */}
      <div className="relative w-[450px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search candidate, vacancy etc..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2A836D]"
        />
      </div>

      {/* Right Controls Container */}
      <div className="flex items-center gap-5" ref={dropdownRef}>

        {/* Notification Trigger Button */}
        <button 
          onClick={() => {
            setShowNotifications(!showNotifications);
            fetchNotificationChats(); // Force update whenever panel is opened
          }}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors relative cursor-pointer ${
            showNotifications ? "bg-gray-100 border-[#2A836D] text-[#2A836D]" : "border-gray-200 hover:bg-gray-100 text-gray-700"
          }`}
        >
          <Bell size={18} />
          {totalUnreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          )}
        </button>

        {/* Profile Element Container */}
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200">
          {user?.profile ? (
            <img
              src={user.profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Notification Modal Drawer Container */}
        {showNotifications && (
          <div className="absolute right-8 top-16 w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col font-custom">
            
            {/* Box Header Elements */}
            <div className="p-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Notification</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filter Navigation Links */}
            <div className="flex px-4 border-b border-gray-100 text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2.5 pr-4 relative transition-colors cursor-pointer ${
                  activeTab === "all" ? "text-[#2A836D]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                All
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-4 h-[2px] bg-[#2A836D]" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("unread")}
                className={`py-2.5 px-4 relative transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "unread" ? "text-[#2A836D]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Unread
                {totalUnreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-50 text-red-600 font-semibold">
                    {totalUnreadCount}
                  </span>
                )}
                {activeTab === "unread" && (
                  <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#2A836D]" />
                )}
              </button>
            </div>

            {/* Content List Items Scroller */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
              {currentList.length > 0 ? (
                currentList.map((chat) => {
                  // Fallbacks to grab properties based on user object models or populated models
                  const targetUser = chat.participants?.find(p => p._id !== user?._id) || chat;
                  const participantName = chat.name || targetUser.name || targetUser.username || "Chat User";
                  const participantProfile = chat.profile || targetUser.profile;
                  const displaySubText = chat.lastMessage || chat.email || "Open chat room";

                  return (
                    <div 
                      key={chat._id || chat.id} 
                      className={`p-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        chat.unreadCount > 0 ? "bg-emerald-50/10" : ""
                      }`}
                    >
                      {/* Avatar picture box component */}
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-100 shrink-0 relative bg-gray-50 flex items-center justify-center">
                        {participantProfile ? (
                          <img 
                            src={participantProfile} 
                            alt={participantName} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User size={16} className="text-gray-400" />
                        )}
                      </div>

                      {/* Content block mapping info metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-gray-800 truncate">
                            {participantName}
                          </h4>
                          
                          {chat.unreadCount > 0 && (
                            <span className="text-[9px] bg-[#2A836D] text-white font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              {chat.unreadCount} New
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-[11px] truncate mt-0.5 ${
                          chat.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-400"
                        }`}>
                          {displaySubText}
                        </p>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-xs text-gray-400 font-light">
                  {activeTab === "unread" 
                    ? "No unread messages right now" 
                    : "No conversations open yet"}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}