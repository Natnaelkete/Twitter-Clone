import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/DB.js";
import authRoutes from "./routes/auth.routes.js";

const port = process.env.PORT || 5000;

connectDb();

const app = express();

app.use("/api/auth", authRoutes);

app.listen(8000, () => {
  console.log(`server is running on port ${port}`);
});
