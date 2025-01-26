import { Router } from "express";
import checkCredentials from "../middleware/authValidation.js";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";
import { LoanUser } from "../models/LoanUser.js";
import postmark from "postmark";
import { LoanRequest } from "../models/LoanRequest.js";

const app = Router();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// app.post("/register", async (req, res) => {
//   try {
//     const { name, cnic, email, password, selectedLoan } = req.body;

//     // Save user to the database
//     const newUser = new LoanUser({ name, cnic, email, password, selectedLoan });
//     await newUser.save();

//     // Prepare the email content
//     const msg = {
//       From: "afaq@wedotes.com", // Replace with your verified sender email
//       To: email,
//       Subject: "Loan Details and Account Creation",
//       TextBody: `Dear ${name},\n\nYour loan application details are as follows:\n\nCategory: ${selectedLoan.category}\nSubcategory: ${selectedLoan.subcategory}\nInitial Deposit: Rs. ${selectedLoan.initialDeposit}\nLoan Period: ${selectedLoan.loanPeriod} years\nLoan Amount: Rs. ${selectedLoan.estimatedLoan.loanAmount}\nAnnual Installment: Rs. ${selectedLoan.estimatedLoan.annualInstallment}\n\nYour temporary password is: ${password}\n\nPlease log in and update your password.\n\nThank you!`,
//     };

//     // Send the email
//     await client.sendEmail(msg);

//     res
//       .status(200)
//       .json({ message: "User registered and email sent successfully!" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while registering the user." });
//   }
// });

app.post("/register", async (req, res) => {
  try {
    const { name, cnic, email, password, selectedLoan } = req.body;

    // Save user to the database
    const newUser = new LoanUser({ name, cnic, email, password, selectedLoan });
    await newUser.save();

    const newRequest = new LoanRequest({ selectedLoan, userId: newUser._id });
    await newRequest.save();

    // Prepare the email content
    const emailText = `Dear ${name},\n\nYour loan application details are as follows:\n\nCategory: ${selectedLoan.category}\nSubcategory: ${selectedLoan.subcategory}\nInitial Deposit: Rs. ${selectedLoan.initialDeposit}\nLoan Period: ${selectedLoan.loanPeriod} years\nLoan Amount: Rs. ${selectedLoan.estimatedLoan.loanAmount}\nAnnual Installment: Rs. ${selectedLoan.estimatedLoan.annualInstallment}\n\nYour temporary password is: ${password}\n\nPlease log in and update your password.\n\nThank you!`;

    const emailHtml = `<p>Dear ${name},</p><p>Your loan application details are as follows:</p><ul><li>Category: ${selectedLoan.category}</li><li>Subcategory: ${selectedLoan.subcategory}</li><li>Initial Deposit: Rs. ${selectedLoan.initialDeposit}</li><li>Loan Period: ${selectedLoan.loanPeriod} years</li><li>Loan Amount: Rs. ${selectedLoan.estimatedLoan.loanAmount}</li><li>Annual Installment: Rs. ${selectedLoan.estimatedLoan.annualInstallment}</li></ul><p>Your temporary password is: <strong>${password}</strong></p><p>Please log in and update your password.</p><p>Thank you!</p>`;

    // Create the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "idfortable@gmail.com", // Replace with your Gmail address
        pass: "acmy dqer dyed nzge", // Replace with your Gmail password (use App Password if 2FA is enabled)
      },
    });

    // Email options
    const mailOptions = {
      from: "idfortable@gmail.com", // Sender email
      to: email, // Recipient email
      subject: "Loan Details and Account Creation",
      text: emailText, // Plain text version of the email
      html: emailHtml, // HTML version of the email
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Send response back to the client
    res
      .status(200)
      .json({ message: "User registered and email sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
});

app.put("/user-loan", async (req, res) => {
  const { userId, guarantors, personalInfo, status, selectedLoan } = req.body;

  try {
    const loanRequest = await LoanRequest.findOne({ userId });

    if (!loanRequest) {
      return res
        .status(404)
        .json({ success: false, error: "Loan request not found" });
    }

    // Update the loan request fields if they are provided in the request body
    if (guarantors) {
      loanRequest.guarantors = guarantors; // Update guarantors if provided
    }
    if (personalInfo) {
      loanRequest.personalInfo = personalInfo; // Update personalInfo if provided
    }
    if (status) {
      loanRequest.status = status; // Update status if provided
    }
    if (selectedLoan) {
      loanRequest.selectedLoan = selectedLoan; // Update selectedLoan if provided
    }

    // Save the updated loan request to the database
    await loanRequest.save();

    res
      .status(200)
      .json({ success: true, message: "Loan request updated successfully" });
  } catch (error) {
    console.error("Error updating loan request:", error);
    res.status(500).json({ error: "Failed to update loan request" });
  }
});

app.post("/loginloan", checkCredentials, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await LoanUser.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No User Exists" });
    }

    // const result = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }
    const safeUser = user.toObject();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "User Founded",
      data: safeUser,
      token,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server Error While adding user" + e.message,
    });
  }
});

app.post("/approveloan", async (req, res) => {
  const { loanId, scheduleDetails } = req.body; // Assuming loanId and scheduleDetails are passed in the request body

  try {
    // Find the loan by loanId
    const loan = await LoanRequest.findById(loanId);

    if (!loan) {
      return res.status(400).json({
        success: false,
        message: "Loan request not found",
      });
    }

    // Update the loan status to approved
    loan.status = "approved";

    // Assuming scheduleDetails is an array of scheduled payment dates/amounts
    // For example: [{ amount: 1000, dueDate: '2025-02-01' }, ...]
    loan.schedule = scheduleDetails; // Add schedule to loan object

    // Save the updated loan document
    await loan.save();

    res.status(200).json({
      success: true,
      message: "Loan request approved successfully",
      data: loan, // Return the updated loan data
    });
  } catch (error) {
    console.error("Error while approving loan:", error);
    res.status(500).json({
      success: false,
      message: "Server Error While approving loan: " + error.message,
    });
  }
});

app.put("/user-loan", async (req, res) => {
  const { userId, guarantors, personalInfo, status } = req.body;

  try {
    const loanRequest = await LoanRequest.findOne({ userId });

    if (!loanRequest) {
      return res.status(404).json({ error: "Loan request not found" });
    }

    // Update the loan request fields
    loanRequest.guarantors = guarantors || loanRequest.guarantors;
    loanRequest.personalInfo = personalInfo || loanRequest.personalInfo;
    loanRequest.status = status || loanRequest.status;
    loanRequest.selectedLoan = selectedLoan || loanRequest.selectedLoan;

    // Save the updated loan request to the database
    await loanRequest.save();

    res.status(201).json({ message: "Loan request submitted successfully" });
  } catch (error) {
    console.error("Error submitting loan request:", error);
    res.status(500).json({ error: "Failed to submit loan request" });
  }
});

app.get("/user-loan-request", async (req, res) => {
  const { email } = req.query; // Getting the userId from query parameters

  try {
    // Find all loan requests associated with the userId
    const loanRequests = await LoanRequest.find({ email });

    if (!loanRequests || loanRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No loan requests found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Loan requests fetched successfully",
      data: loanRequests,
    });
  } catch (error) {
    console.error("Error fetching loan requests:", error);
    res.status(500).json({
      success: false,
      message: "Server Error While fetching loan requests: " + error.message,
    });
  }
});

app.get("/loanrequests", async (req, res) => {
  try {
    // Fetch all loan requests from the LoanRequest model
    const loanRequests = await LoanRequest.find();

    if (!loanRequests || loanRequests.length === 0) {
      return res.status(404).json({ message: "No loan requests found." });
    }

    res.status(200).json({
      success: true,
      message: "Loan requests fetched successfully",
      data: loanRequests,
    });
  } catch (error) {
    console.error("Error fetching loan requests:", error);
    res.status(500).json({ error: "Failed to fetch loan requests" });
  }
});

// app.post("/signup", checkCredentials, async (req, res) => {
//   const { username, email, password } = req.body;
//   const encryptedPass = await bcrypt.hash(password, 10);

//   try {
//     const newUser = await User.create({
//       username,
//       email,
//       password: encryptedPass,
//     });
//     const safeData = newUser.toObject();
//     delete safeData.password;
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Created User Succesfully",
//       data: safeData,
//       token,
//     });
//   } catch (e) {
//     console.log(e);
//     if (e.code == 11000) {
//       return res.status(500).json({
//         success: false,
//         message: "User already exist ",
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Server Error While adding user : " + e.message,
//     });
//   }
// });

app.post("/login", checkCredentials, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No User Exists" });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }
    const safeUser = user.toObject();
    delete safeUser.password;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "User Founded",
      data: safeUser,
      token,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server Error While adding user" + e.message,
    });
  }
});

// app.post("/sendemail", (req, res) => {
//   const { token, email } = req.body;

//   if (!token || !email || typeof email !== "string") {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid input. 'email' must be a single valid email address.",
//     });
//   }

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.USERNAME,
//       pass: process.env.PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.USERNAME,
//     to: "saaddotes@gmail.com",
//     subject: "Email Verification",
//     html: `Click the link to verify your email: <a href="http://192.168.0.108:4000/auth/verifyemail/${token}">Verify Email</a>`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error("Error sending email:", err.message);
//       return res.status(400).json({ success: false, error: err.message });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Email sent successfully",
//       info,
//     });
//   });
// });

// app.get("/verifyemail/:token", async (req, res) => {
//   const { token } = req.params;

//   if (!token) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Token Required. :(" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err)
//       return res.status(400).json({ success: false, message: "Invalid Token" });

//     return res
//       .status(200)
//       .json({ success: true, message: "Verifed Email Successfully.", user });
//   });
// });

export default app;
