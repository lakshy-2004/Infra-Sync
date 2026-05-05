import express from "express";
import mongoose from "mongoose";

import authMiddleware from "../middlewares/requireLogin.js";
import Post from "../models/post.js";
import User from "../models/model.js";

const router = express.Router();

//  Check
router.get("/", (req, res) => {
  res.json("ok");
});

// Get user posts

router.get("/userPosts", authMiddleware, async (req, res) => {
  try {
    
    const posts = await Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name userName photo") 
      .sort({ createdAt: -1 });

    
    const user = await User.findById(req.user._id).select("_id name userName photo email");

    return res.status(200).json({
      user, 
      posts,  
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ error: "Server error while fetching posts" });
  }
});



//  Get all post
router.get("/allPosts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name userName email photo")
      .sort({ createdAt: -1 }); 

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// LIKE a post
router.put("/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: req.user._id } }, 
      { new: true }
    ).populate("postedBy", "_id name userName email");

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(" Error liking post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UNLIKE a post
router.put("/unlike", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: req.user._id } }, 
      { new: true }
    ).populate("postedBy", "_id name userName email");

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// get all users liked on post
router.get("/getLikes/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params; 
    const post = await Post.findById(postId).populate(
      "likes",
      "_id name userName email"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ likes: post.likes, totalLikes: post.likes.length });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(422).json({ error: "Server Error" });
  }
});

// Comment
router.put("/comment", authMiddleware, async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment || !postId) {
      return res.status(400).json({ error: "Post ID and comment required" });
    }

    const newComment = {
      comment,
      postedBy: req.user._id,
    };

    
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });


    const updatedPost = await Post.findById(postId)
      .populate("comments.postedBy", "_id name userName email") 
      .populate("postedBy", "_id name userName email");          

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// Get comments for a post
router.get("/getComments/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "comments.postedBy",
      "_id name userName photo"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      comments: post.comments, 
      totalComments: post.comments.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// edit comment

router.put(
  "/editComment/:postId/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { newComment } = req.body; 

      const updatedPost = await Post.findOneAndUpdate(
        {
          _id: postId,
          "comments._id": commentId,
          "comments.postedBy": req.user._id,
        },
        { $set: { "comments.$.comment": newComment } },
        { new: true }
      )
        .populate("comments.postedBy", "_id name userName")
        .populate("postedBy", "_id name userName");

      if (!updatedPost) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error editing comment:", error);
      res.status(422).json({ error: "Server error" });
    }
  }
);

// delete comment

router.delete(
  "/deleteComment/:postId/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const updatedPost = await Post.findOneAndUpdate(
        {
          _id: postId,
          "comments._id": commentId,
          "comments.postedBy": req.user._id,
        }, // ensure only owner can deletecomment
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      )
        .populate("comments.postedBy", "_id name userName")
        .populate("postedBy", "_id name userName");
      if (!updatedPost) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      res.status(200).json({
        message: "Comment deleted successfully",
        post: updatedPost,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(422).json({ error: "Server error" });
    }
  }
);

//  Post
router.post("/createPost", authMiddleware, async (req, res) => {
  try {
    const { title, body, location, photo } = req.body;

    // Validate required fields
    if (!title || !body || !location || !photo) {
      return res.status(422).json({
        error: "Please fill all the fields including photo URL",
      });
    }

    // Create new post with photo URL
    const post = new Post({
      title,
      body,
      location,
      photo, 
      postedBy: req.user,
    });

    const result = await post.save();

    // Respond with status 200 OK and the post data
    res.status(200).json({ post: result });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
});

// Delete Post ( for user )
router.delete("/deletePost/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    
    if (!postId || !postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      postedBy: req.user._id,
    });

    if (!deletedPost) {
      return res
        .status(404)
        .json({ error: "Post not found or you're not authorized to delete it" });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
