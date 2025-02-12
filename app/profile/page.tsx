"use client";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";

function Profile() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", bio: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);

        // 🔥 Fetch fresh session data from DB after update
        update();

        setFormData({ username: "", email: "", password: "", bio: "" });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center">
      <Navbar />

      {/* Centered Profile Card */}
      <div className="flex items-center justify-center flex-grow">
        {session ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-8 rounded-2xl text-white flex flex-col items-center w-[90%] max-w-[450px]">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-600">
                  {session.user?.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-semibold mt-4">{session.user?.name}</h2>
            <p className="text-gray-300">{session.user?.email}</p>

            {/* Editable Fields - Two Fields per Row */}
            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Update Name"
                className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60 col-span-1"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Update Email"
                className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60 col-span-1"
                onChange={handleChange}
              />
            </div>

            {/* Password & Bio Fields */}
            <div className="mt-3 w-full">
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Update Password"
                className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 w-full">
              <textarea
                name="bio"
                value={formData.bio}
                placeholder="Update Bio"
                className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60 resize-none"
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-4 w-full">
              <button
                onClick={handleUpdate}
                className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => signOut()}
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white text-xl">You are not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;





