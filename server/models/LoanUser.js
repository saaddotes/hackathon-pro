import mongoose from "mongoose";
const loanUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isNew: { type: Boolean, required: true, default: true },
  password: { type: String, required: true },
});

export const LoanUser = mongoose.model("loanusers", loanUserSchema);
