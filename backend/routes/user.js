import express from "express";
import mongoose from "mongoose";

import authMiddleware from "../middlewares/requireLogin.js";
import Post from "../models/post.js";
import User from "../models/model.js";

const router = express.Router();

// check
router.get("/", async (req,res) => {
    res.send("hello");
})

// current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select("_id name userName photo");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// get user details 
router.get("/user/:userId", authMiddleware, async(req,res) =>{
    try {
        
        const {userId} = req.params;
        const user = await User.findById(userId).select("-password -email");    
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({postedBy: userId})
        .populate("postedBy", "_id name userName photo")
        .sort({createdAt: -1});
        
        res.status(200).json({
            user,
            posts,
        })

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
})

// Update profile picture
router.put("/photo", authMiddleware, async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(422).json({ error: "Profile picture is required" });
    }

    // Update user photo
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { photo },
      { new: true, select: "-password -email" } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile pic:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// delete/remove profile picture
router.delete("/deletePhoto", authMiddleware, async (req,res) => {
    try {
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {photo: ""},
            {new: true}
        )
        .select("-password -email");

        if(!updatedUser){
            return res.status(404).json({
                error: "User not found"
            })
        }
        res.status(200).json({
            message: "Profile picture removed successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error removing profile pic:", error);
        res.status(422).json({ error: "Server error" });
    }
})


export default router;