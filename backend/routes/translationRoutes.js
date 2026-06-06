import express from "express";
import { translateTextController, updateUserLanguage } from "../controllers/translationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/translate", verifyToken, translateTextController);
router.put("/user/language", verifyToken, updateUserLanguage);

export default router;
