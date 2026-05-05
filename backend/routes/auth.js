import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/model.js";
import authMiddleware from "../middlewares/requireLogin.js";
// import authMiddleware from "../middlewares/requireLogin.js";

const router = express.Router();
dotenv.config();

// check
router.get("/", (req, res) => {
  res.send("hello");
});

// post
router.get("/post",authMiddleware, (req,res) => {
    res.send("hello");
} )

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const existUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existUser) {
      return res
        .status(409)
        .json({ error: "User already exists with that email or username" });
    }

    const hash_password = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      userName,
      email,
      password: hash_password,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("SignUp error !! ", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const is_Match = await bcrypt.compare(password, user.password);
    if (!is_Match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // optional: expires in 7 days
    });

    res.status(200).json({
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("SignIn error !! ", error);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
