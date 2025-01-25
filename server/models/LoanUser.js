import mongoose from "mongoose";
const loanUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  isNew: { type: Boolean, required: true, default: true },
  password: { type: String, required: true },
  selectedLoan: {
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    initialDeposit: { type: Number, required: true },
    loanPeriod: { type: Number, required: true },
    estimatedLoan: {
      loanAmount: { type: Number, required: true },
      annualInstallment: { type: Number, required: true },
    },
  },
});

export const LoanUser = mongoose.model("loanusers", loanUserSchema);
