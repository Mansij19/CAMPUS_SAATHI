import express from "express";
import {
  getAdminDashboard,
  getAdminUsers,
  createAdminNotice,
  createAdminFAQ,
  createAdminScholarship
} from "../controllers/adminController.js";
import { authorizeRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply verifyToken and authorizeRole('admin') globally to all admin routes
router.use(verifyToken);
router.use(authorizeRole("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.post("/notices", createAdminNotice);
router.post("/faqs", createAdminFAQ);
router.post("/scholarships", createAdminScholarship);

export default router;
