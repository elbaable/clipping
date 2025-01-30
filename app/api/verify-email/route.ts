import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // If no token is provided, return an error response
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  // Decode the token (in this case, we're using Base64 encoding)
  const userId = Buffer.from(token, "base64").toString("utf-8");

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return an error response
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user is already verified, return a message
    if (user.email_verified) {
      return NextResponse.json({ message: "Email already verified!" }, { status: 200 });
    }

    // Update the user's email_verified status to true
    user.email_verified = true;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
