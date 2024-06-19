import express from "express";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;

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
