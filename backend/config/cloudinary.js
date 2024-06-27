import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storageForProfile = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Twitter_profile/cover",
    allowed_formats: ["jpg", "png", "webp"],
  },
});

const storageForPost = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Twitter_Post",
    allowed_formats: ["jpg", "png", "webp"],
  },
});

export { cloudinary, storageForPost, storageForProfile };
