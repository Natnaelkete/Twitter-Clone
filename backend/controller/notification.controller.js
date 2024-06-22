import { populate } from "dotenv";
import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notification.model.js";

export const getNotification = asyncHandler(async (req, res, next) => {
  try {
    const notification = await Notification.find({ to: req.user._id })
      .populate("from", "username profileImg")
      .populate("to", "username profileImg");

    if (!notification || notification.length === 0) {
      return res.status(200).json({ message: "No notification", data: [] });
    }

    await Notification.updateMany({ to: req.user._id }, { read: true });

    res.status(200).json(notification);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

export const deleteAllNotification = asyncHandler(async (req, res, next) => {
  try {
    const notification = await Notification.find({ to: req.user._id });
    if (!notification || notification.length === 0) {
      return res.status(200).json({ message: "No notification", data: [] });
    }
    await Notification.deleteMany({ from: req.user._id });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Delete users notification
// route GET api/notification/delete/:id
// access Private
export const deleteUserNotification = asyncHandler(async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }
    await Notification.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});
