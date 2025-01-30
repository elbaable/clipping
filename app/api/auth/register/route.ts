import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

// Ensure that MongoDB is connected
dbConnect();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check if email is already registered
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: "Email is already registered." }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  const newUser = new User({
    email,
    password: hashedPassword,
    role: "Publisher",
    email_verified: false,
  });

  try {
    // Save the user to MongoDB
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser);

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
