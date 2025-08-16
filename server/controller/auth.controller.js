import { sendPasswordResetEmail, sendVerificationEmail } from "../lib/mailtrap/email.js";
import { User } from "../models/User.js";
import {
  genVeryficationCode,
  genTokenAndSetCookie,
} from "../utils/genVeryficationCode.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function signUp(req, res, next) {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required field",
      });
    }

    let user = await User.findOne({ email });
    const verificationToken = genVeryficationCode();

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    if (user && !user.isVerified) {
      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();

      genTokenAndSetCookie(res, user._id);
      await sendVerificationEmail(user.email, verificationToken);

      return res.status(200).json({
        success: true,
        message: "Verification email resent",
        user,
      });
    }

    user = await User.create({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    genTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function signIn(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required field",
      });
    }
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email credentials",
      });
    }

    if (user && !user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    genTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sign in successfully",
      user: {
        ...user._doc,
        _id: undefined,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in signin controller" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signOut(req, res, next) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Sign Out successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function verifyEmail(req, res, next) {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function forgotPassWord(req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    console.log(`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
