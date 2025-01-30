import mongoose, { Document, Schema } from "mongoose";

// Define the User interface
interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  email_verified: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "Publisher",
    },
    email_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
