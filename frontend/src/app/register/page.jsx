'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from "@/services/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Split the email prefix into two parts if a dot or underscore exists,
    // otherwise default both to the prefix.
    const emailPrefix = formData.email.split("@")[0];
    const parts = emailPrefix.split(/[._-]/); 
    const fallbackFirstName = parts[0];
    const fallbackSecondName = parts[1] || parts[0]; 

    try {
      const res = await api.post("/user/register", {
        firstName: fallbackFirstName, 
        secondName: fallbackSecondName, // Changed from lastName to secondName
        email: formData.email,
        password: formData.password,
        website: formData.website,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Registration Successful");

      window.location.href = "/login";
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#F8F9FA] font-custom antialiased">
      
      {/* LEFT SIDE: Multistep Form Fields Layout Wrapper */}
      <div className="flex flex-1 flex-col items-center justify-between p-6 md:p-12 min-h-screen md:min-h-0">
        {/* Spacer to keep center card vertical parity */}
        <div className="hidden md:block"></div>

        {/* Polished Form White Box Wrapper to avoid mobile stretching */}
        <div className="w-full max-w-[400px] bg-white rounded-[32px] shadow-sm border border-gray-200 p-8 md:p-10 flex flex-col items-center my-auto">
          
          {/* Logo Brand Header - Width and Height fixed per Next.js console warning */}
          <div className="mb-6 select-none relative w-[180px] h-[50px]">
            <Image 
              src="/images/logo.png" 
              alt="ChatzKeep Logo"
              fill
              priority
              className="object-contain"
              sizes="180px"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Register</h1>
          <p className="text-sm text-gray-400 font-light mb-8 text-center">
            Create an account to get started
          </p>

          {error && (
            <div className="w-full p-3 mb-4 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Form Step 1 View */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="w-full space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="getwell@kmchhospitals.com"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              {/* Website Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  Website (Optional)
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="www.kmchhospitals.com"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 422 - 4378720"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2A836D] hover:bg-[#226B59] text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm mt-2 text-center text-sm cursor-pointer"
              >
                Continue
              </button>
            </form>
          )}

          {/* Form Step 2 View */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Address Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="No.18, Vivekananda Road, Ram Nagar"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              {/* City Input */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Coimbatore"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                />
              </div>

              {/* State and Pincode Split Row Layout */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Tamilnadu"
                    required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                  />
                </div>

                <div className="relative flex-1">
                  <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="641009"
                    required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D]"
                  />
                </div>
              </div>

              {/* Multi-step Navigation Action Row */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-500 font-medium py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all text-sm text-center cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-[#2A836D] hover:bg-[#226B59] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm text-sm text-center disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Do you have an account?{' '}
              <Link href="/login" className="text-[#2A836D] font-semibold hover:underline ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-light mt-6 md:mt-0">
          &copy;2026 Chatzkeep. All rights reserved
        </p>
      </div>

      {/* RIGHT SIDE: 3-LAYER FIGMA COMPILATION CONTAINER WITH SIZES PROP FIXED */}
      <div className="hidden md:block flex-1 relative bg-[#1E5E4E] overflow-hidden">
        
        {/* LAYER 1: Green Background */}
        <Image
          src="/images/greenbg.png" 
          alt="Layer 1: Green Organic Base backdrop"
          fill
          priority
          className="object-cover z-0"
          sizes="50vw"
        />

        {/* LAYER 2: Curly Wave Overlay */}
        <div className="absolute inset-0 mix-blend-normal opacity-40 z-10 pointer-events-none">
          <Image
            src="/images/curly.png" 
            alt="Layer 2: Curly wave element"
            fill
            className="object-contain scale-110 translate-y-4"
            sizes="50vw"
          />
        </div>

        {/* TOP LAYER CONTENT STRATUM: Enhanced Rectangle and Image Cards */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20 text-white">
          
          {/* THE MOCKUP QUOTE RECTANGLE BOX */}
          <div className="w-full max-w-[390px] bg-black/15 border border-white/10 backdrop-blur-md rounded-[28px] p-6 text-center shadow-xl mb-6">
            <h2 className="text-2xl font-semibold leading-snug tracking-wide select-none">
              Very good works are<br />waiting for you<br />
              <span className="font-bold text-emerald-300 opacity-95">Login Now</span>
            </h2>
          </div>
          
          {/* LAYER 3: Doctor Interactive Window Card Frame */}
          <div className="relative w-full max-w-[390px] aspect-[4/5] rounded-[36px] overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 p-4 shadow-2xl transition-all duration-500 ease-in-out">
            
            <div className="relative w-full h-full rounded-[26px] overflow-hidden">
              {step === 1 ? (
                <Image
                  key="doc-image-1"
                  src="/images/register1.png" 
                  alt="Layer 3 Variant A: Primary Medical Staff"
                  fill
                  priority
                  className="object-cover object-top transition-all duration-500 transform scale-100"
                  sizes="35vw"
                />
              ) : (
                <Image
                  key="doc-image-2"
                  src="/images/register2.png" 
                  alt="Layer 3 Variant B: Doctor pointing variant"
                  fill
                  priority
                  className="object-cover object-top transition-all duration-500 transform scale-105"
                  sizes="35vw"
                />
              )}
            </div>

          </div>
        </div>

        <div className="absolute inset-0 bg-black/5 pointer-events-none z-30"></div>
      </div>

    </div>
  );
}