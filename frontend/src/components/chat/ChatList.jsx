"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function ChatList({ selectedUser, setSelectedUser, users = [] }) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const firstName = user?.firstName || "";
    const secondName = user?.secondName || "";
    const fullName = `${firstName} ${secondName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="w-[320px] bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#2A836D]"
        />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-160px)]">
        {filteredUsers.map((user) => (
          <div
            key={user?._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition ${
              selectedUser?._id === user?._id ? "bg-gray-100" : ""
            }`}
          >
            <div className="relative">
              {user?.profile ? (
                <img
                  src={user.profile}
                  alt={user?.firstName || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-800 truncate">
                {user?.firstName || ""} {user?.secondName || ""}
              </h4>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">No users found</div>
        )}
      </div>
    </div>
  );
}