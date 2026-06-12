"use client";

import Image from "next/image";
import { X } from "lucide-react";

export default function ProfileModal({
  isOpen,
  onClose,
  user,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-2xl w-[450px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="text-xl font-semibold">
            Candidate Profile
          </h2>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}
        <div className="p-6">

          <div className="flex flex-col items-center">

            <Image
              src={user.image}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full"
            />

            <h3 className="mt-4 text-lg font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-500">
              Candidate
            </p>

          </div>

          <div className="mt-8 space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium">
                {user.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-medium">
                {user.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Resume
              </p>

              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#2A836D] font-medium"
              >
                View Resume
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}