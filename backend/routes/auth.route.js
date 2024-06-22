import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

export default router;
