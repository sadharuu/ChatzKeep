"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useSocket } from "@/context/SocketContext";

export default function LoginPage() {
  const socket = useSocket();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post(
        "/user/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      
      socket.emit(
        "join",
        res.data.user._id
      );

      alert("Login Successful");

      router.push("/chat");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#F8F9FA] font-custom">

      {/* Left Side */}
      <div className="flex flex-1 flex-col items-center justify-between p-6 md:p-12">

        <div className="hidden md:block"></div>

        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col items-center">

          {/* Logo */}
          <div className="mb-6 select-none">
            <Image
              src="/images/logo.png"
              alt="ChatzKeep Logo"
              width={180}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            Login
          </h1>

          <p className="text-sm text-gray-400 font-light mb-8">
            Welcome back! Sign in to your account.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-6"
          >

            {/* Email */}
            <div className="relative">
              <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D] focus:ring-1 focus:ring-[#2A836D] transition-colors pr-10"
              />

              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <CheckCircle2 className="h-5 w-5 text-[#2A836D] fill-[#2A836D]/10" />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="absolute -top-2.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400">
                Password
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter password"
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#2A836D] focus:ring-1 focus:ring-[#2A836D] transition-colors pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2A836D] hover:bg-[#226B59] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* Register Link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#2A836D] font-semibold hover:underline ml-1"
              >
                Register now
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 font-light mt-6 md:mt-0">
          &copy;2025 ChatzKeep. All rights reserved
        </p>

      </div>

      {/* Right Side Image */}
      <div className="hidden md:block flex-1 relative bg-gray-100">

        <Image
          src="/images/doctor.png"
          alt="Healthcare Recruitment Team"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 0vw, 50vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>

      </div>

    </div>
  );
}