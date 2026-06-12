"use client";

import { useEffect, useState } from "react";
import { Search, Bell, User } from "lucide-react";
import Image from "next/image";
import api from "@/services/api";

export default function TopNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      {/* Search Bar */}
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

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100">
          <Bell size={18} />
        </button>

        {/* Profile */}
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200">

          {user?.profile ? (
            <img
              src={user.profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User
                size={20}
                className="text-gray-500"
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}