import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/backend/models/User";
import connectDB from "@/backend/config/db";

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure database connection

    const { email, password } = await req.json();

    // Check if the email or password is missing
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find the user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    console.log("User Retrieved:", user); // Debugging Step

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // Debugging Step

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Ensure JWT secret is defined
    if (!process.env.JWT_SECRET) {
      console.error("🔥 Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json(
      { message: "Login successful", token, user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
