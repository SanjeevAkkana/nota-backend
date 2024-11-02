import User from "../models/User.js";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";



export const getAllUsers = (req, res) => {
    res.json({ msg: "Get all users." })
}

// Transporter for sending verification email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "asanjeevroyal@gmail.com",
        pass: "lzjz zedc qkxn acnv",
    },
});

// Send verification email with OTP
const sendVerificationEmail = async (to, username, otp) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333333;">Welcome to Nota, ${username}!</h2>
            <p style="color: #666666; font-size: 16px;">Please use the following OTP to verify your email address:</p>
            <h3 style="text-align: center; color: #22BC66; font-size: 24px; letter-spacing: 1px;">${otp}</h3>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Nota - Verify Your Email",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

// Create User with OTP
export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
            verified: false,
        });
        await user.save();

        // Send verification email with OTP
        await sendVerificationEmail(email, name, otp);

        res.json({ msg: "User created. Verification email sent." });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};

export const verifyAccount = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        // Check if OTP matches and hasn't expired
        if (user.otp === otp) {
            // Update user verification status
            user.verified = true;
            user.otp = null; // Clear OTP after verification
            await user.save();

            return res.json({ msg: "Account verified successfully." });
        } else {
            return res.status(400).json({ msg: "Invalid or expired OTP." });
        }
    } catch (error) {
        console.error("Error verifying account:", error);
        res.status(500).json({ error: "Error verifying account." });
    }
};

export const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        // Generate a new OTP and set expiration time
        const otp = crypto.randomInt(100000, 999999).toString();

        // Update OTP and expiration in the database
        user.otp = otp;
        user.verified = false;
        await user.save();

        // Send verification email with the new OTP
        await sendVerificationEmail(email, user.name, otp);

        res.json({ msg: "New OTP has been sent to your email." });
    } catch (error) {
        console.error("Error resending OTP:", error);
        res.status(500).json({ error: "Error resending OTP." });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If user doesn't exist
        if (!user) {
            return res.status(400).json({ msg: "User not found." });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        // Check if user is verified
        if (!user.verified) {
            // Trigger resend OTP function
            await resendOTP(req, res);
            return res.status(403).json({ msg: "Account not verified. A new OTP has been sent to your email." });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, "12345");

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Error logging in." });
    }
};

export const forgotPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user with the provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password in the database
        user.password = hashedPassword;
        await user.save();

        res.json({ msg: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ msg: "An error occurred while updating the password." });
    }
};