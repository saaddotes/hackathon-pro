import mongoose from "mongoose";

const loanRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoanUser", // Reference to the LoanUser model
  },
  guarantors: [
    {
      name: {
        type: String,

        default: null,
      },
      email: {
        type: String,

        default: null,
      },
      location: {
        type: String,

        default: null,
      },
      cnic: {
        type: String,

        default: null,
      },
    },
  ],
  personalInfo: {
    address: {
      type: String,

      default: null,
    },
    phone: {
      type: String,

      default: null,
    },
  },
  status: {
    type: String,
    enum: ["incomplete", "pending", "approved", "rejected"],
    default: "incomplete",
  },
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
  schedule: {
    date: {
      type: Date,
      default: null, // Default to null
    },
    time: {
      type: String,
      default: null, // Default to null
    },
    officeLocation: {
      type: String,
      default: "Not provided", // Default to "Not provided"
    },
  },
});

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

export { LoanRequest };
