import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  uploadPost,
  commentOnPost,
  likeUnlikePost,
  getAllPost,
  getLikedPost,
  getFollowingPosts,
  getUsersPost,
} from "../controller/post.controller.js";
import protect from "../middleware/authMiddleware.js";

router.post("/create", protect, uploadPost.array("images", 3), createPost);
router.get("/all", protect, getAllPost);
router.get("/like", protect, getLikedPost);
router.get("/following", protect, getFollowingPosts);
router.get("/user/:username", protect, getUsersPost);
router.post("/comment/:postId", protect, commentOnPost);
router.post("/like/:postId", protect, likeUnlikePost);
router.delete("/delete/:id", protect, deletePost);

export default router;
