import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/backend/models/User";
import connectDB from "@/backend/config/db";

export async function POST(req: Request) {
  await connectDB();

  try {
    console.log("🔍 Incoming Registration Request");

    const body = await req.json();
    console.log("📥 Request Body:", body); // ✅ Log incoming data

    if (!body?.username || !body?.email || !body?.password) {
      console.log("🚨 Missing Fields Detected");
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // Verify User Model Exists
    if (!User) {
      console.error("🔥 User Model Not Found");
      return NextResponse.json({ error: "User model error" }, { status: 500 });
    }

    const existingUser = await User.findOne({ email });
    console.log("🔍 Checking If User Exists:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    console.log("🔒 Hashing Password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password Hashed Successfully");

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("✅ User Saved Successfully:", newUser);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔥 Registration Failed:", error.message);
    return NextResponse.json(
      { error: `Error registering user: ${error.message}` },
      { status: 500 }
    );
  }
}
