import express from "express";
import Auth from "../controller/auth.controller.js";

const router = express.Router();

router.get("/", Auth);

export default router;
