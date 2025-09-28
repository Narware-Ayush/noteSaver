import { Router, Request, Response } from "express";
import User from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config()
const router = Router();

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
router.post("/sendotp", async (req: Request, res: Response) => {
  try {
    const { name, dob, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    const otp = generateOTP();
    console.log(otp,"otp hai bhai save kar le")
    
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid 5 mins

    if (!user) {
      user = new User({ name, dob, email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };
    
    console.log("mail tarnsfer ho rahi hai")

    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}`);
    return res.json({ message: "OTP sent successfully to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP
router.post("/verifyotp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires && user.otpExpires < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // OTP valid, clear it
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
