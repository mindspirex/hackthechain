"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { UserIcon, KeyIcon, ChevronDownIcon } from "lucide-react";
import background from "@/components/bg.jpeg";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const apiEndpoint =
      role === "student"
        ? `${process.env.SERVER}/api/login/student`
        : `${process.env.SERVER}/api/login/teacher`;

    try {
      const response = await axios.post(apiEndpoint, { email, password });
      localStorage.setItem("token", response.data.token);
      window.location.href =
        role === "student" ? "/student-dashboard" : "/teacher-dashboard";
    } catch (error) {
      console.error(error);
      alert("Incorrect Credentials");
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#d4d6ea] to-[#b1b5c6]">
      <div className="flex min-h-screen p-12 rounded-3xl">
        <div className="w-1/2 flex items-center justify-center bg-white rounded-lg shadow-2xl">
          <div className="p-10 rounded-3xl shadow-2xl w-96 space-y-6 border border-gray-200">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#3674B5]">
                Welcome Back!
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your details to access your account
              </p>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 pl-10 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent"
                    required
                    placeholder="Enter your email"
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 pl-10 focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:border-transparent"
                    required
                    placeholder="Enter your password"
                  />
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-[#578FCA] text-white rounded-lg font-medium hover:bg-[#3674B5] transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#3674B5] focus:ring-offset-2"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="w-1/2 bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] rounded-lg flex items-center justify-center shadow-2xl">
          <Image
            src={background}
            alt="Decorative background"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
