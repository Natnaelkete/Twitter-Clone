import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";
import {
  getUsersProfile,
  followUnFollowUsers,
  getSuggestedUsers,
  updateUsers,
  uploadProfile,
} from "../controller/user.controller.js";

router.get("/suggested", protect, getSuggestedUsers);
router.post(
  "/update",
  protect,
  uploadProfile.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  updateUsers
);

router.get("/profile/:username", protect, getUsersProfile);
router.post("/follow/:id", protect, followUnFollowUsers);

export default router;
