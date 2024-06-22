import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.model.js";
import Notification from "../models/notification.model.js";
import { cloudinary, storageForProfile } from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import multer from "multer";

export const uploadProfile = multer({
  storageForProfile,
});

// desc Get Users Profile
// route GET api/users/profile/:username
// access Private
export const getUsersProfile = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Follow/Unfollow Users
// route POST api/users/follow/:id
// access Private
export const followUnFollowUsers = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const existUser = user.following.includes(id);

    if (existUser) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      await Notification.deleteMany({
        type: "follow",
        from: req.user._id,
        to: id,
      });

      res.status(200).json({ message: "User UnFollowed successfully" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });
      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    next(error);
  }
});

// desc Get Suggested users
// route GET api/users/suggested
// access Private
export const getSuggestedUsers = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userFollowedByMe = await User.findById(userId)
      .select("following")
      .lean();
    const followingIds = userFollowedByMe.following.map((id) => id.toString());

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId, $nin: followingIds },
        },
      },
      { $sample: { size: 10 } },
      {
        $project: {
          password: 0,
          // username:1 // if i want to include only the username
        },
      },
    ]);
    const suggestedUsers = users.slice(0, 4);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// desc Update users
// route GET api/users
// access Private
export const updateUsers = asyncHandler(async (req, res, next) => {
  try {
    const {
      fullName,
      username,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (req.files) {
      const { profileImg, coverImg } = req.files;
      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(
            user.profileImg.split("/").pop().split(".")[0]
          );
        }
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url;
      }
      if (coverImg) {
        if (user.coverImg) {
          await cloudinary.uploader.destroy(
            user.coverImg.split("/").pop().split(".")[0]
          );
        }
        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url;
      }
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400);
        throw new Error("The current password is incorrect");
      }

      user.password = newPassword;
    } else if (currentPassword || newPassword) {
      res.status(400);
      throw new Error("Provide both current and new password");
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      link: updatedUser.link,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// export const uploadImage = async (req, res) => {
//   try {
//     const file = req.files.image; // Assuming the image file is sent as 'image' in form-data

//     // Validate file format
//     const allowedFormats = ["jpg", "png", "webp"];
//     const fileExtension = file.name.split(".").pop().toLowerCase();

//     if (!allowedFormats.includes(fileExtension)) {
//       return res.status(400).json({ message: "Invalid file format" });
//     }

//     // Upload the image to Cloudinary with folder and allowed formats
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: "uploads", // Specify the folder
//       allowed_formats: ["jpg", "png", "webp"], // Specify allowed formats
//       use_filename: true,
//       unique_filename: false,
//     });

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       res.status(404);
//       throw new Error("User not found");
//     }

//     user.profileImage = result.secure_url; // Save the image URL in the user document
//     await user.save();

//     res.status(200).json({
//       message: "Image uploaded successfully",
//       imageUrl: result.secure_url,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Image upload failed", error: error.message });
//   }
// };
