import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/DB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postsRoutes from "./routes/post.route.js";
import {
  notFound,
  errorHandler,
  multerErrorHandler,
} from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDb();

const app = express();

app.use(cookieParser());
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);

app.use(notFound);
app.use(errorHandler);
app.use(multerErrorHandler);

app.listen(8000, () => {
  console.log(`server is running on port ${port}`);
});
