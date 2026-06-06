import express from "express";
import { deleteChatHistory, getChatHistory, sendMessage } from "../controllers/chatController.js";
import { authorizeRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("student", "admin"));
router.post("/", sendMessage);
router.get("/history", getChatHistory);
router.delete("/history", deleteChatHistory);

export default router;
