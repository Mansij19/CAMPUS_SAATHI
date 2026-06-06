import express from "express";
import { getStudentActivity } from "../controllers/studentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/activity", verifyToken, getStudentActivity);

export default router;
