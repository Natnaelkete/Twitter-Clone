import Post from "../models/post.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { cloudinary, storageForPost } from "../config/cloudinary.js";
import multer from "multer";
import Notification from "../models/notification.model.js";
import User from "../models/User.model.js";

const uploadPost = multer({
  storage: storageForPost,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// desc Create Post
// route POST api/post/create
// access Private
export const createPost = asyncHandler(async (req, res, next) => {
  try {
    const imageUrls = req.files.map((file) => file.path);
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || !req.files.length === 0) {
      res.status(400);
      throw new Error("Please provide text for the post");
    }

    const post = new Post({
      user: userId,
      text,
      img: imageUrls,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Delete Post
// route POST api/post/delete
// access Private
export const deletePost = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (!post.user.equals(req.user._id)) {
      res.status(400);
      throw new Error("You are not authorized to delete");
    }

    if (post.img.length > 0) {
      for (const img of post.img) {
        const publicId = `Twitter_Post/${img.split("/").pop().split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Comment on Post
// route POST api/post/comment/:postId
// access Private
export const commentOnPost = asyncHandler(async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const userPost = await Post.findById(postId);
    if (!userPost) {
      res.status(404);
      throw new Error("There is no post with this id");
    }

    userPost.comments.push({
      text,
      user: req.user._id,
    });

    const newComment = await userPost.save();

    res.status(200).json(newComment);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// desc Line and Unlike a Post
// route POST api/post/like/:postId
// access Private
export const likeUnlikePost = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const currentUser = await User.findOne(req.user._id);

    if (!post) {
      res.status(404);
      throw new Error("There is no post with this id");
    }

    const userId = req.user._id;

    const preExistedLike = post.likes.includes(userId);
    // const preExistedLikedPost = currentUser.likedPosts.includes(postId);

    if (preExistedLike) {
      post.likes.pull(userId);
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      await post.save();
      await Notification.deleteMany({
        from: req.user._id,
        to: postId,
        type: "like",
      });
      res.json({ message: "Post unliked" });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();
      const newNotification = new Notification({
        from: req.user._id,
        to: postId,
        type: "like",
      });
      await newNotification.save();
      res.json({ message: "Post liked" });
    }

    // res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Comment on Post
// route POST api/post/comment/:postId
// access Private
export const getAllPost = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc get Liked Posts
// route POST api/post/like/:postId
// access Private
export const getLikedPost = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const LikedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(LikedPosts);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc get Following Posts
// route POST api/post/following
// access Private
export const getFollowingPosts = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      res.status(404);
      throw new Error("User not found");
    }

    const posts = await Post.find({ user: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc get Users Posts
// route POST api/post/users/:GET
// access Private
export const getUsersPost = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const getPost = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password")
      .exec();

    if (!getPost) {
      return res.status(200).json([]);
    }

    res.status(200).json(getPost);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// desc get Users Profile
// route POST api/post/users/profile/:username
// access Private
export const getUsersProfile = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password").exec();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export { uploadPost };
