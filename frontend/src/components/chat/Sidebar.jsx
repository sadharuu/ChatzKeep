"use client";

import Image from "next/image";
import {
  MessageCircle,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-[250px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-5">

      {/* Top Section */}
      <div>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={40}
          />
        </div>

        {/* Menu */}
        <div className="space-y-3">

          {/* Message */}
          <button
            onClick={() => router.push("/chat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === "/chat"
                ? "bg-[#2A836D] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageCircle size={20} />
            <span>Message</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push("/settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === "/settings"
                ? "bg-[#2A836D] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>

        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-[#2A836D] to-[#56b39d] rounded-2xl p-4 text-white">

        <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-4">
          💬
        </div>

        <h3 className="font-semibold text-sm mb-2">
          Get Unlimited Access
        </h3>

        <p className="text-xs mb-4">
          Subscription keeps going and going and going...
        </p>

        <button className="w-full bg-white text-[#2A836D] font-medium py-2 rounded-lg">
          Subscribe Now
        </button>

      </div>

    </div>
  );
}