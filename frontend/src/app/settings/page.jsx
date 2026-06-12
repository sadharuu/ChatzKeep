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
  Check,
  X
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef(null);

  // Form State - Standardized to use secondName to match your Mongoose Schema precisely
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      const userData = res.data.user;
      setUser(userData);
      
      // Seed form values using secondName
      setFormData({
        firstName: userData?.firstName || "",
        secondName: userData?.secondName || "",
        phone: userData?.phone || "",
        website: userData?.website || "",
        address: userData?.address || "",
        city: userData?.city || "",
        state: userData?.state || "",
        pincode: userData?.pincode || ""
      });
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const uploadData = new FormData();
      uploadData.append("profile", file);

      const res = await api.put("/user/upload-profile", uploadData);
      setUser(res.data.user);
      window.location.reload();
    } catch (error) {
      console.log("Profile upload failed:", error);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await api.put("/user/update", formData);
      setUser(res.data.user);
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to save profile changes:", error);
    } finally {
      setIsSaving(false);
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
    <div className="h-screen flex bg-[#f8f9fa] font-custom">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Layout Block */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <TopNavbar />
        
        <input type="file" hidden ref={fileRef} onChange={handleProfileUpload}/>
        
        {/* Scrollable Workspace Container */}
        <div className="p-8 overflow-y-auto flex-1">

          {/* Profile Card Workspace Container */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Profile Information
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Manage your account details
                </p>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#2A836D] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#236d5a] transition-all cursor-pointer shadow-sm disabled:opacity-70"
                  >
                    <Check size={16} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#2A836D] text-white px-5 py-3 rounded-xl text-sm hover:bg-[#236d5a] transition-colors cursor-pointer shadow-sm"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Picture Bar */}
            <div className="flex items-center gap-6 mb-10">
              {user?.profile ? (
                <img
                  src={user.profile}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shadow-sm">
                  <User size={36} className="text-gray-400" />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {user?.firstName} {user?.secondName}
                </h3>
                <p className="text-gray-400 text-sm">
                  {user?.email}
                </p>
                <button
                  onClick={() => fileRef.current.click()}
                  className="mt-3 px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Upload Profile Picture
                </button>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                  <div className="flex items-center gap-3 mt-1.5 min-h-[42px]">
                    <User size={18} className="text-gray-400 shrink-0" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user?.firstName || "—"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                  <div className="flex items-center gap-3 mt-1.5 min-h-[42px]">
                    <User size={18} className="text-gray-400 shrink-0" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="secondName"
                        value={formData.secondName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user?.secondName || "—"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-3 mt-1.5 min-h-[42px]">
                    <Mail size={18} className="text-gray-400 shrink-0" />
                    <p className="text-sm font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-full cursor-not-allowed">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <div className="flex items-center gap-3 mt-1.5 min-h-[42px]">
                    <Phone size={18} className="text-gray-400 shrink-0" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user?.phone || "—"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Website</label>
                  <div className="flex items-center gap-3 mt-1.5 min-h-[42px]">
                    <Globe size={18} className="text-gray-400 shrink-0" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user?.website || "—"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary Location Address</label>
                  <div className="flex items-start gap-3 mt-1.5">
                    <MapPin size={18} className="text-gray-400 shrink-0 mt-2" />
                    {isEditing ? (
                      <div className="space-y-3 w-full">
                        <input 
                          type="text" 
                          name="address"
                          placeholder="Street Address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                          />
                          <input 
                            type="text" 
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                          />
                        </div>
                        <input 
                          type="text" 
                          name="pincode"
                          placeholder="Pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#2A836D]"
                        />
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-700 space-y-0.5 pt-1.5">
                        <p>{user?.address || "—"}</p>
                        {(user?.city || user?.state) && (
                          <p>{user?.city}{user?.city && user?.state ? ", " : ""}{user?.state}</p>
                        )}
                        {user?.pincode && <p>{user?.pincode}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Secondary Structural View Container (Synced Display) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Address Snapshot
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Street Address</p>
                <p className="text-gray-700 font-medium text-sm mt-1.5 truncate">{isEditing ? formData.address || "—" : user?.address || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">City</p>
                <p className="text-gray-700 font-medium text-sm mt-1.5 truncate">{isEditing ? formData.city || "—" : user?.city || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">State</p>
                <p className="text-gray-700 font-medium text-sm mt-1.5 truncate">{isEditing ? formData.state || "—" : user?.state || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pincode</p>
                <p className="text-gray-700 font-medium text-sm mt-1.5 truncate">{isEditing ? formData.pincode || "—" : user?.pincode || "—"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}