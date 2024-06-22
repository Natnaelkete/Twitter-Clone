import express from "express";
import {
  getNotification,
  deleteAllNotification,
  deleteUserNotification,
} from "../controller/notification.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotification);
router.delete("/", protect, deleteAllNotification);
router.delete("/delete/:id", protect, deleteUserNotification);

export default router;
