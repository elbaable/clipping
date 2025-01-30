import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  try {
    await dbConnect();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
