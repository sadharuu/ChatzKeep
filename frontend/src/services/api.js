import axios from "axios";

const api = axios.create({
  // Dynamically uses Vercel's env variable first, falls back to port 4000/5000 on local dev
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  
  // ⚡ CRITICAL FIX: Allows cookies, authorization tokens, and cross-origin sessions 
  // to successfully pass between your Vercel frontend and Render backend.
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  // Safe execution block to prevent Next.js Server-Side Rendering (SSR) 
  // from crashing when trying to look for a browser-only localStorage layer
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;