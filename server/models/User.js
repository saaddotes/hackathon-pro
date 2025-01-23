import mongoose from "mongoose";

const userSch = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  isVerified: { type: String, default: false },
});

export const User = mongoose.model("cleanusers", userSch);
