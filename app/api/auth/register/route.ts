import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/db/connection";
import EcomUser from "@/models/ecomUser";

export async function POST(req: Request) {
  try {
    const { username, email, password, bio } = await req.json();

    // Check if all fields are provided
    if (!username || !email || !password || !bio) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await EcomUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists!" }, { status: 409 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new EcomUser({
      username,
      email,
      password: hashedPassword,
      bio,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
