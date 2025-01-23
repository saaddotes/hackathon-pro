import { Router } from "express";
import checkCredentials from "../middleware/authValidation.js";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = Router();

app.post("/signup", checkCredentials, async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPass = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      email,
      password: encryptedPass,
    });
    const safeData = newUser.toObject();
    delete safeData.password;
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Created User Succesfully",
      data: safeData,
      token,
    });
  } catch (e) {
    console.log(e);
    if (e.code == 11000) {
      return res.status(500).json({
        success: false,
        message: "User already exist ",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error While adding user : " + e.message,
    });
  }
});

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

app.post("/sendemail", (req, res) => {
  const { token, listOfEmails } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME, // Your Gmail address
      pass: process.env.PASSWORD, // Your App Password
    },
  });

  const mailOptions = {
    from: process.env.USERNAME,
    to: listOfEmails,
    subject: "Email Verification",
    html: `Click the link to verify your email: <a href="http://192.168.0.108:4000/auth/verifyemail/${token}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      info,
    });
  });
});

app.get("/verifyemail/:token", async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token Required. :(" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(400).json({ success: false, message: "Invalid Token" });

    return res
      .status(200)
      .json({ success: true, message: "Verifed Email Successfully.", user });
  });
});

export default app;
