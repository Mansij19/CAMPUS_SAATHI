import Conversation from "../models/Conversation.js";
import { generateCampusAnswer } from "../services/geminiService.js";
import { generateFallbackAnswer } from "../services/featherlessService.js";
import { devDeleteConversation, devFindConversation, devPushMessages, isDevStore } from "../utils/devStore.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userMessage = {
      role: "user",
      content: message.trim(),
      timestamp: new Date()
    };

    let aiResponse;
    let provider = "gemini";

    try {
      aiResponse = await generateCampusAnswer(message, req.user.preferredLanguage);
    } catch (error) {
      provider = "featherless";
      aiResponse = await generateFallbackAnswer(message, req.user.preferredLanguage, error.message);
    }

    const assistantMessage = {
      role: "assistant",
      content: aiResponse.answer,
      timestamp: new Date()
    };

    if (isDevStore()) {
      const conversation = await devPushMessages(req.user._id, [userMessage, assistantMessage]);
      return res.json({
        answer: aiResponse.answer,
        detectedLanguage: aiResponse.detectedLanguage,
        provider,
        messages: conversation.messages
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { messages: { $each: [userMessage, assistantMessage] } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      answer: aiResponse.answer,
      detectedLanguage: aiResponse.detectedLanguage,
      provider,
      messages: conversation.messages
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    if (isDevStore()) {
      const conversation = await devFindConversation(req.user._id);
      return res.json({ messages: conversation?.messages || [] });
    }

    const conversation = await Conversation.findOne({ userId: req.user._id });
    res.json({ messages: conversation?.messages || [] });
  } catch (error) {
    next(error);
  }
};

export const deleteChatHistory = async (req, res, next) => {
  try {
    if (isDevStore()) {
      await devDeleteConversation(req.user._id);
      return res.json({ message: "Chat history cleared" });
    }

    await Conversation.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Chat history cleared" });
  } catch (error) {
    next(error);
  }
};
