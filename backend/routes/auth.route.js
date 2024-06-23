import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

export default router;
