"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/services/api";
import { User } from "lucide-react";

export default function ChatList({
  selectedUser,
  setSelectedUser,
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      
      // Add standard safe arrays check path fallback
      const fetchedUsers = res.data?.users || [];
      setUsers(fetchedUsers);
      
      // FIXED: Wrapped state selection inside a microtask frame 
      // to keep state execution aligned safely after the initial render loop complete
      if (fetchedUsers.length > 0 && !selectedUser) {
        setTimeout(() => {
          setSelectedUser(fetchedUsers[0]);
        }, 0);
      }
    } catch (error) {
      console.log("Failed to load users layout data: ", error);
    }
  };

  // FIXED: Optional chaining protection keys against empty model records
  const filteredUsers = users.filter((user) => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="w-[320px] bg-white border-r border-gray-200">

      {/* Search Bar Input Container */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#2A836D]"
        />
      </div>

      {/* Scrollable User List Strand Wrapper */}
      <div className="overflow-y-auto h-[calc(100vh-160px)]">
        {filteredUsers.map((user) => (
          <div
            key={user?._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition ${
              selectedUser?._id === user?._id ? "bg-gray-100" : ""
            }`}
          >
            {/* Profile Avatar Frame rendering blocks */}
            <div className="relative">
              {user?.profile ? (
                <img
                  src={user.profile}
                  alt={user?.firstName || "User Image"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* Individual Grid User Text Information elements */}
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-800">
                {user?.firstName || ""} {user?.lastName || ""}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        ))}

        {/* Dynamic Fallback View condition rules */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}