import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import EcomUser from "@/models/ecomUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import type { ExtendedSession } from "@/app/api/auth/[...nextauth]/route"; // Import the type


interface UpdateUser {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
}

export async function PUT(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession;
    console.log("Session:", session); // Debugging log

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    await connectToDatabase();
    const { username, email, password, bio } = await req.json();

    const updates:  UpdateUser = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (bio) updates.bio = bio;

    // Find and update user by ID
    const updatedUser = await EcomUser.findByIdAndUpdate(session.user.id, updates, { new: true });

    return NextResponse.json({
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


