import express from "express";
import {
  createNotification,
  getNotifications,
  markNotificationRead
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.post("/", verifyToken, createNotification);
router.patch("/:id/read", verifyToken, markNotificationRead);

export default router;
