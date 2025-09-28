import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  dob?: string;
  email: string;
  otp?: string;
  otpExpires?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  dob: { type: String },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
});

export default mongoose.model<IUser>("User", UserSchema);
