import express from "express";
import { deleteNotice, getNotices, summarizeNotice, uploadNotice } from "../controllers/noticeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadDocument } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadDocument.single("file"), uploadNotice);
router.post("/summarize", verifyToken, summarizeNotice);
router.post("/:id/summarize", verifyToken, summarizeNotice);
router.get("/", verifyToken, getNotices);
router.delete("/:id", verifyToken, deleteNotice);

export default router;
