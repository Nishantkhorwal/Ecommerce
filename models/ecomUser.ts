import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" }, // Added bio field
  },
  { timestamps: true }
);
const EcomUser = mongoose.models.EcomUser || mongoose.model<IUser>("EcomUser", UserSchema);
export default EcomUser;
