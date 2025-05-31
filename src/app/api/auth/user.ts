import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/backend/models/User";
import connectDB from "@/backend/config/db";

export async function GET(req: Request) {
  await connectDB();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded Token:", decoded); // ✅ Debugging Step

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Token does not contain userId" },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Token Verification Error:", error.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
