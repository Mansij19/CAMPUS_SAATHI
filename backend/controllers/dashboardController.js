import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Form from "../models/Form.js";
import Notice from "../models/Notice.js";
import Scholarship from "../models/Scholarship.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";
import {
  devCountUsers,
  devFindConversation,
  devListConversations,
  devRecentUsers,
  devListForms,
  devListScholarships,
  devListNotifications,
  devListActivities,
  devListNotices,
  devCountAllNotices,
  devCountAllForms,
  isDevStore
} from "../utils/devStore.js";

export const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isDevStore()) {
      const [
        conversation,
        forms,
        scholarships,
        notifications,
        activities,
        notices
      ] = await Promise.all([
        devFindConversation(userId),
        devListForms(userId),
        devListScholarships(),
        devListNotifications(userId),
        devListActivities(userId),
        devListNotices()
      ]);

      const messages = conversation?.messages || [];
      const recentChats = messages.filter((msg) => msg.role !== "system").slice(-5);

      // Collect deadlines
      const deadlines = [];
      scholarships.forEach((s) => {
        deadlines.push({
          id: s._id || s.id,
          title: `Apply for ${s.name}`,
          date: s.deadline,
          type: "scholarship"
        });
      });
      notices.forEach((n) => {
        if (n.deadlines && Array.isArray(n.deadlines)) {
          n.deadlines.forEach((d) => {
            deadlines.push({
              id: n._id || n.id,
              title: `${n.title} - Deadline`,
              date: typeof d === "string" ? d : d.date || d.deadline || new Date().toISOString(),
              type: "notice"
            });
          });
        }
      });

      // Sort deadlines by date ascending
      deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

      return res.json({
        welcome: `Welcome back, ${req.user.name}`,
        profile: req.user,
        stats: {
          totalMessages: messages.length,
          preferredLanguage: req.user.preferredLanguage,
          uploadedDocuments: forms.length,
          activeScholarships: scholarships.length,
          unreadNotifications: notifications.filter((n) => n.status === "unread").length
        },
        recentChats,
        uploadedDocuments: forms.slice(0, 5),
        scholarshipRecommendations: scholarships.slice(0, 3),
        notifications: notifications.slice(0, 5),
        upcomingDeadlines: deadlines.slice(0, 4),
        recentActivity: activities.slice(0, 5)
      });
    }

    // MongoDB Mode
    const [
      conversation,
      forms,
      scholarships,
      notifications,
      activities,
      notices
    ] = await Promise.all([
      Conversation.findOne({ userId }),
      Form.find({ userId }).sort({ createdAt: -1 }),
      Scholarship.find().sort({ deadline: 1 }),
      Notification.find({ $or: [{ userId }, { userId: null }] }).sort({ createdAt: -1 }),
      Activity.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Notice.find().sort({ createdAt: -1 })
    ]);

    const messages = conversation?.messages || [];
    const recentChats = messages.filter((msg) => msg.role !== "system").slice(-5);

    // Collect deadlines
    const deadlines = [];
    scholarships.forEach((s) => {
      deadlines.push({
        id: s._id,
        title: `Apply for ${s.name}`,
        date: s.deadline,
        type: "scholarship"
      });
    });
    notices.forEach((n) => {
      if (n.deadlines && Array.isArray(n.deadlines)) {
        n.deadlines.forEach((d) => {
          deadlines.push({
            id: n._id,
            title: `${n.title} - Deadline`,
            date: typeof d === "string" ? d : d.date || d.deadline || new Date().toISOString(),
            type: "notice"
          });
        });
      }
    });

    deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      welcome: `Welcome back, ${req.user.name}`,
      profile: req.user,
      stats: {
        totalMessages: messages.length,
        preferredLanguage: req.user.preferredLanguage,
        uploadedDocuments: forms.length,
        activeScholarships: scholarships.length,
        unreadNotifications: notifications.filter((n) => n.status === "unread").length
      },
      recentChats,
      uploadedDocuments: forms.slice(0, 5),
      scholarshipRecommendations: scholarships.slice(0, 3),
      notifications: notifications.slice(0, 5),
      upcomingDeadlines: deadlines.slice(0, 4),
      recentActivity: activities
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    if (isDevStore()) {
      const [totalUsers, recentRegistrations, conversations, noticesCount, formsCount] = await Promise.all([
        devCountUsers(),
        devRecentUsers(10),
        devListConversations(),
        devCountAllNotices(),
        devCountAllForms()
      ]);

      const totalQueries = conversations.reduce((count, conv) => {
        return count + conv.messages.filter((msg) => msg.role === "user").length;
      }, 0);

      return res.json({
        stats: {
          totalUsers,
          totalQueries,
          activeConversations: conversations.length,
          noticesCount,
          formsCount
        },
        recentRegistrations,
        users: recentRegistrations // Maintain both naming patterns
      });
    }

    const [totalUsers, recentRegistrations, conversations, noticesCount, formsCount] = await Promise.all([
      User.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select("-password"),
      Conversation.find().select("messages"),
      Notice.countDocuments(),
      Form.countDocuments()
    ]);

    const totalQueries = conversations.reduce((count, conv) => {
      return count + conv.messages.filter((msg) => msg.role === "user").length;
    }, 0);

    res.json({
      stats: {
        totalUsers,
        totalQueries,
        activeConversations: conversations.length,
        noticesCount,
        formsCount
      },
      recentRegistrations,
      users: recentRegistrations
    });
  } catch (error) {
    next(error);
  }
};
