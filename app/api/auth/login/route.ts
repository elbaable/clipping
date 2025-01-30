// app/api/login/route.ts (or pages/api/login.js for older Next.js versions)
import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";  // Ensure you have a User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // Connect to the database
    await dbConnect();

    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      // Return error if user is not found
      return NextResponse.json({ error: "Invalid email address." }, { status: 401 });
    }

    if (!user.email_verified) {
      // Return error if user is not found
      return NextResponse.json({ error: "Email is not verified." }, { status: 401 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // Return error if passwords do not match
      return NextResponse.json({ error: "Password does not match." }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Return success message if login is successful
    const response = NextResponse.json({ message: "Login successful!" }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
