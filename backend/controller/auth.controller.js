import crypto from "crypto";
import express from "express";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import sendEmail from "../utils/email.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, username, email, password, passwordConfirm } = req.body;

    const usersUsername = await User.findOne({ username });
    if (usersUsername) {
      res.status();
      throw new Error("Username is already taken");
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(401);
      throw new Error("User already registered");
    }

    const newUser = await User.create({
      fullName,
      username,
      email,
      password,
      passwordConfirm,
    });

    if (newUser) {
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
        followers: user.followers,
        following: user.following,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

export const logout = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// desc Forgot Password
// route POST api/auth/forgotPassword
// access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("There is no user with this email address");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400);
    throw new Error("There was an error sending the email, Try again later");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or has expired");
  }

  if (!req.body.password || !req.body.passwordConfirm) {
    res.status(400);
    throw new Error("Password and password confirmation are required");
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  generateToken(user._id, res);

  res.status(200).json(userWithoutPassword);
});
