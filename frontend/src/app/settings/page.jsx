"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/services/api";

import Sidebar from "@/components/chat/Sidebar";
import TopNavbar from "@/components/chat/TopNavbar";

import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Pencil,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("profile", file);

      const res = await api.put("/user/upload-profile", formData);
      setUser(res.data.user);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen font-custom flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen font-custom flex bg-[#f8f9fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Layout Block */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar Component (Handles page titles efficiently) */}
        <TopNavbar />
        
        <input type="file" hidden ref={fileRef} onChange={handleProfileUpload}/>
        
        {/* Scrollable Workspace Container */}
        <div className="p-8 overflow-y-auto flex-1">

          {/* Profile Card Workspace Container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-semibold">
                  Profile Information
                </h2>
                <p className="text-gray-500">
                  Manage your account details
                </p>
              </div>

              <button className="flex items-center gap-2 bg-[#2A836D] text-white px-5 py-3 rounded-xl hover:bg-[#236d5a]">
                <Pencil size={18} />
                Edit Profile
              </button>
            </div>

            {/* Profile Picture Upload Bar */}
            <div className="flex items-center gap-6 mb-10">
              {user?.profile ? (
                <img
                  src={user.profile}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <User size={40} className="text-gray-400" />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-500">
                  {user?.email}
                </p>
                <button
                  onClick={() => fileRef.current.click()}
                  className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Upload Profile Picture
                </button>
              </div>
            </div>

            {/* Profile Grid Field Mapping */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <div className="flex items-center gap-3 mt-1">
                    <User size={18} className="text-gray-400" />
                    <p className="text-gray-700">{user?.firstName || "—"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <div className="flex items-center gap-3 mt-1">
                    <User size={18} className="text-gray-400" />
                    <p className="text-gray-700">{user?.lastName || "—"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <div className="flex items-center gap-3 mt-1">
                    <Mail size={18} className="text-gray-400" />
                    <p className="text-gray-700">{user?.email || "—"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <div className="flex items-center gap-3 mt-1">
                    <Phone size={18} className="text-gray-400" />
                    <p className="text-gray-700">{user?.phone || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-500">Website</label>
                  <div className="flex items-center gap-3 mt-1">
                    <Globe size={18} className="text-gray-400" />
                    <p className="text-gray-700">{user?.website || "—"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <div className="flex items-start gap-3 mt-1">
                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                    <div className="text-gray-700">
                      <p>{user?.address || "—"}</p>
                      {(user?.city || user?.state) && (
                        <p>{user?.city}{user?.city && user?.state ? ", " : ""}{user?.state}</p>
                      )}
                      {user?.pincode && <p>{user?.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-8">
            <h2 className="text-xl font-semibold mb-6">
              Address Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Street Address</p>
                <p className="text-gray-700 font-medium mt-1">{user?.address || "—"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">City</p>
                <p className="text-gray-700 font-medium mt-1">{user?.city || "—"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">State</p>
                <p className="text-gray-700 font-medium mt-1">{user?.state || "—"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Pincode</p>
                <p className="text-gray-700 font-medium mt-1">{user?.pincode || "—"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}