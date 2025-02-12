"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, bio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed!");

      setMessage("✅ Registration successful! You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setBio("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("❌ An unknown error occurred");
      }
    }
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 rounded-2xl backdrop-blur-sm bg-transparent border border-white/20 shadow-lg">
        <h2 className="text-white text-center text-2xl font-semibold mb-4">Register</h2>

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 text-white bg-transparent border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70 rounded-lg"
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-white bg-transparent border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70 rounded-lg"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-transparent border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70 rounded-lg"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* Bio Input */}
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 text-white bg-transparent border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70 rounded-lg resize-none h-24"
            required
          ></textarea>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-white font-semibold rounded-lg border border-white/30 outline-none focus:ring-2 focus:ring-white/40 transition ${
              loading ? "bg-white/10 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Status Message */}
        {message && <p className="text-center text-sm mt-4 text-white">{message}</p>}
      </div>
    </div>
  );
}

export default Register;

