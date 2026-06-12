"use client";

import { useState } from "react";
import Image from "next/image";
import ProfileModal from "./ProfileModal";

export default function ChatHeader({ selectedUser }) {
  const [openProfile, setOpenProfile] = useState(false);

  // CHANGED: Returning a fragment instead of null prevents the Turbopack syntax compilation error
  if (!selectedUser) return <></>;

  return (
    <>
      <div className="h-20 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {selectedUser.profile ? (
              <img
                src={selectedUser.profile}
                alt={selectedUser.firstName || "User"}
                className="w-[55px] h-[55px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[55px] h-[55px] rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                {selectedUser.firstName?.[0] || "?"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {selectedUser.firstName || ""}{" "}
              {selectedUser.secondName || ""}
            </h3>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>

        <button
          onClick={() => setOpenProfile(true)}
          className="border border-[#2A836D] text-[#2A836D] px-5 py-2 rounded-lg hover:bg-[#2A836D] hover:text-white transition cursor-pointer"
        >
          View Profile
        </button>
      </div>

      <ProfileModal
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
        user={selectedUser}
      />
    </>
  );
}