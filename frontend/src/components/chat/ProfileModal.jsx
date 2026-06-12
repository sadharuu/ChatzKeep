"use client";

import Image from "next/image";
import { X, User, Mail, Phone, MapPin } from "lucide-react";

export default function ProfileModal({
  isOpen,
  onClose,
  user,
}) {
  if (!isOpen || !user) return null;

  // Combine first and second names safely with standard fallbacks
  const fullName = `${user.firstName || ""} ${user.secondName || ""}`.trim() || "Anonymous User";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center backdrop-blur-sm">

      <div className="bg-white rounded-2xl w-[450px] max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Candidate Profile
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Top Profile Image / Title Segment */}
          <div className="flex flex-col items-center border-b border-gray-100 pb-6">
            {user.profile ? (
              <Image
                src={user.profile}
                alt={fullName}
                width={100}
                height={100}
                className="rounded-full object-cover w-[100px] h-[100px] border-2 border-gray-100 shadow-sm"
                unoptimized // Useful if your profile photos come directly from S3/Cloudinary links
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                <User size={44} className="text-gray-400" />
              </div>
            )}

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {fullName}
            </h3>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">
              Candidate
            </p>
          </div>

          {/* Essential Information Grid Layout */}
          <div className="mt-6 space-y-5">

            <div className="flex items-start gap-3.5">
              <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">
                  {user.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">
                  {user.phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Location Info
                </p>
                <div className="text-sm font-medium text-gray-700 mt-0.5 space-y-0.5">
                  {user.address && <p>{user.address}</p>}
                  {(user.city || user.state) && (
                    <p>
                      {user.city}
                      {user.city && user.state ? ", " : ""}
                      {user.state}
                    </p>
                  )}
                  {user.pincode && <p className="text-gray-500 text-xs font-mono">{user.pincode}</p>}
                  {!user.address && !user.city && !user.state && <p>—</p>}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}