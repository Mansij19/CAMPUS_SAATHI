import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import {
  devCountUsers,
  devFindConversation,
  devListConversations,
  devRecentUsers,
  isDevStore
} from "../utils/devStore.js";

export const getStudentDashboard = async (req, res, next) => {
  try {
    if (isDevStore()) {
      const conversation = await devFindConversation(req.user._id);
      const messages = conversation?.messages || [];
      const recentChats = messages.filter((message) => message.role !== "system").slice(-6);

      return res.json({
        welcome: `Welcome back, ${req.user.name}`,
        profile: req.user,
        stats: {
          totalMessages: messages.length,
          preferredLanguage: req.user.preferredLanguage,
          lastActive: conversation?.updatedAt || req.user.updatedAt
        },
        recentChats
      });
    }

    const conversation = await Conversation.findOne({ userId: req.user._id });
    const messages = conversation?.messages || [];
    const recentChats = messages.filter((message) => message.role !== "system").slice(-6);

    res.json({
      welcome: `Welcome back, ${req.user.name}`,
      profile: req.user,
      stats: {
        totalMessages: messages.length,
        preferredLanguage: req.user.preferredLanguage,
        lastActive: conversation?.updatedAt || req.user.updatedAt
      },
      recentChats
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (_req, res, next) => {
  try {
    if (isDevStore()) {
      const [totalUsers, recentRegistrations, conversations] = await Promise.all([
        devCountUsers(),
        devRecentUsers(8),
        devListConversations()
      ]);
      const totalQueries = conversations.reduce((count, conversation) => {
        return count + conversation.messages.filter((message) => message.role === "user").length;
      }, 0);

      return res.json({
        stats: {
          totalUsers,
          totalQueries,
          activeConversations: conversations.length
        },
        recentRegistrations,
        users: recentRegistrations
      });
    }

    const [totalUsers, recentRegistrations, conversations] = await Promise.all([
      User.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(8).select("-password"),
      Conversation.find().select("messages updatedAt")
    ]);

    const totalQueries = conversations.reduce((count, conversation) => {
      return count + conversation.messages.filter((message) => message.role === "user").length;
    }, 0);

    res.json({
      stats: {
        totalUsers,
        totalQueries,
        activeConversations: conversations.length
      },
      recentRegistrations,
      users: recentRegistrations
    });
  } catch (error) {
    next(error);
  }
};
