"use client"
import Navbar from '@/components/Navbar'
import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setError("")
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/") // Redirect to homepage or dashboard
    }
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <h2 className="text-white text-center text-2xl font-semibold mb-4">Login</h2>

        <div className="flex flex-col space-y-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-white bg-transparent rounded-lg border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-transparent rounded-lg border border-white/30 outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-white font-semibold bg-white/20 rounded-lg border border-white/30 outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/30 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login


