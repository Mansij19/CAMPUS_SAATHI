import express from "express";
import { getAdminDashboard, getStudentDashboard } from "../controllers/dashboardController.js";
import { authorizeRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", verifyToken, authorizeRole("student"), getStudentDashboard);
router.get("/admin", verifyToken, authorizeRole("admin"), getAdminDashboard);

export default router;
