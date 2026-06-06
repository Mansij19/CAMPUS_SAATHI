import express from "express";
import { analyzeForm, deleteForm, getFormHistory, uploadForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadDocument } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadDocument.single("file"), uploadForm);
router.post("/analyze", verifyToken, analyzeForm);
router.post("/:id/analyze", verifyToken, analyzeForm);
router.get("/history", verifyToken, getFormHistory);
router.delete("/:id", verifyToken, deleteForm);

export default router;
