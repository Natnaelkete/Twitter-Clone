import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";
import {
  getUsersProfile,
  followUnFollowUsers,
  getSuggestedUsers,
  updateUsers,
} from "../controller/user.controller.js";

router.get("/suggested", protect, getSuggestedUsers);
router.post("/update", protect, updateUsers);
router.get("/profile/:username", protect, getUsersProfile);
router.post("/follow/:id", protect, followUnFollowUsers);

export default router;
