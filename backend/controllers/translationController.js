import User from "../models/User.js";
import Activity from "../models/Activity.js";
import { devCreateActivity, devUpdateUser, isDevStore } from "../utils/devStore.js";
import { translateText } from "../services/translationService.js";

export const translateTextController = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: "Text and targetLanguage are required" });
    }

    const translatedText = await translateText(text, targetLanguage);
    res.json({ originalText: text, translatedText, targetLanguage });
  } catch (error) {
    next(error);
  }
};

export const updateUserLanguage = async (req, res, next) => {
  try {
    const { language } = req.body;
    const userId = req.user._id;

    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }

    const validLanguages = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ message: `Language must be one of: ${validLanguages.join(", ")}` });
    }

    const activityDesc = `Changed preferred language to ${language}`;

    if (isDevStore()) {
      const user = await devUpdateUser(userId, { preferredLanguage: language });
      await devCreateActivity({ userId, type: "language", description: activityDesc });
      return res.json({ message: "Language preference updated", user });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { preferredLanguage: language },
      { new: true }
    ).select("-password");

    await Activity.create({
      userId,
      type: "language",
      description: activityDesc
    });

    res.json({ message: "Language preference updated", user });
  } catch (error) {
    next(error);
  }
};
