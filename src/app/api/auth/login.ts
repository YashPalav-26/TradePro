import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/backend/models/User";
import connectDB from "@/backend/config/db";

export async function POST(req: Request) {
  await connectDB(); // Ensure database connection
  const { email, password } = await req.json();

  try {
    // Find the user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    console.log("User Retrieved:", user); // Debugging Step

    // If user is not found, return an error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // Debugging Step

    // If passwords do not match, return an error
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d", // Token expires in 7 days
    });

    // Return a success response with the token and user details
    return NextResponse.json(
      { message: "Login successful", token, user },
      { status: 200 }
    );
  } catch (error: any) {
    // Log the error and return a server error response
    console.error("Login Error:", error.message);
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}
