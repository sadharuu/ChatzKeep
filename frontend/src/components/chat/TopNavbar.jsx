"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, User, X } from "lucide-react";
import api from "@/services/api";

export default function TopNavbar({ users = [], selectedUser, refreshUsers, lastMessagesMap = {} }) {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      console.log(error);
    }
  };

  // --- RENDERING FILTER LOGIC ---
  const allNotifications = users;

  // Filters users who have an active unread flag or counter status
  const unreadNotifications = users.filter((u) => {
    if (selectedUser?._id === u?._id) return false;
    return u.unreadCount > 0 || u.isUnread === true || u.hasNewMessage === true;
  });

  const totalUnreadCount = unreadNotifications.length;
  const currentList = activeTab === "all" ? allNotifications : unreadNotifications;

  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative z-50">
      
      {/* Search Bar */}
      <div className="relative w-[450px]">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidate, vacancy etc..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2A836D]"
        />
      </div>

      {/* Right Controls Container */}
      <div className="flex items-center gap-5" ref={dropdownRef}>
        
        {/* Notification Bell */}
        <button 
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (refreshUsers) refreshUsers();
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

        {/* Profile Avatar Frame */}
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200">
          {user?.profile ? (
            <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Dropdown Notification panel rendering overlay layout */}
        {showNotifications && (
          <div className="absolute right-8 top-16 w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col font-custom">
            <div className="p-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Notification</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Filter Navigation Tabs */}
            <div className="flex px-4 border-b border-gray-100 text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2.5 pr-4 relative transition-colors cursor-pointer ${
                  activeTab === "all" ? "text-[#2A836D]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                All
                {activeTab === "all" && <div className="absolute bottom-0 left-0 right-4 h-[2px] bg-[#2A836D]" />}
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
                {activeTab === "unread" && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#2A836D]" />}
              </button>
            </div>

            {/* List Loop View layout components */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
              {currentList.length > 0 ? (
                currentList.map((item) => {
                  const participantName = `${item?.firstName || ""} ${item?.lastName || ""}`.trim() || "User";
                  const participantProfile = item?.profile;
                  
                  // FIXED: Changed from item?.email to look up the mapped last message string value
                  const displaySubText = lastMessagesMap[item?._id] || item?.lastMessage || "No messages exchanged yet";

                  return (
                    <div 
                      key={item?._id} 
                      className="p-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-100 shrink-0 relative bg-gray-50 flex items-center justify-center">
                        {participantProfile ? (
                          <img src={participantProfile} alt={participantName} className="h-full w-full object-cover" />
                        ) : (
                          <User size={16} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-gray-800 truncate">{participantName}</h4>
                          {(item.unreadCount > 0 || item.isUnread) && (
                            <span className="text-[9px] bg-[#2A836D] text-white font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              New
                            </span>
                          )}
                        </div>
                        {/* Will cleanly display the message string or fallback phrase snippet */}
                        <p className="text-[11px] truncate mt-0.5 text-gray-400">{displaySubText}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-xs text-gray-400 font-light">
                  {activeTab === "unread" ? "No unread messages" : "No conversations open yet"}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}