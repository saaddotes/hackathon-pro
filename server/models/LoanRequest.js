import mongoose from "mongoose";

const loanRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoanUser", // Reference to the LoanUser model
    required: true,
  },
  guarantors: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      cnic: {
        type: String,
        required: true,
      },
    },
  ],
  personalInfo: {
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Schedule fields with default values
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
