import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "your-mongodb-uri"; // Use your MongoDB URI

let isConnected = false;

export const dbConnect = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("MongoDB connected!");

        // Check if there is an admin user in the database
    const adminExists = await User.findOne({ role: "Admin" });

    if (!adminExists) {
      // Create the default admin user if no admin exists
      const defaultAdmin = new User({
        email: "trahughes1026@gmail.com",
        password: await bcrypt.hash("password", 12), // Hash the password
        role: "Admin",
        email_verified: true,
      });

      await defaultAdmin.save();
      console.log("Default admin created!");
    }
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
