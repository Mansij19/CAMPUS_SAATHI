import User from "../models/User.js";
import FAQ from "../models/FAQ.js";
import Notice from "../models/Notice.js";
import Scholarship from "../models/Scholarship.js";
import Conversation from "../models/Conversation.js";
import Form from "../models/Form.js";
import {
  devCountUsers,
  devRecentUsers,
  devListConversations,
  devCountAllNotices,
  devCountAllForms,
  devCreateFAQ,
  devCreateScholarship,
  devCreateNotice,
  isDevStore
} from "../utils/devStore.js";

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
        recentRegistrations
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
      recentRegistrations
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    if (isDevStore()) {
      const users = await devRecentUsers(100);
      return res.json({ users });
    }

    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const createAdminNotice = async (req, res, next) => {
  try {
    const { title, originalText, deadlines, eligibility } = req.body;

    if (!title || !originalText) {
      return res.status(400).json({ message: "Title and text content are required" });
    }

    const payload = {
      title,
      originalText,
      summary: {
        points: [originalText.slice(0, 100) + "..."],
        deadlines: deadlines ? [deadlines] : [],
        eligibility: eligibility ? [eligibility] : []
      },
      deadlines: deadlines ? [deadlines] : [],
      eligibility: eligibility ? [eligibility] : [],
      uploadedBy: req.user._id,
      fileUrl: "/uploads/text-notice.pdf" // Mock file path for manual entries
    };

    const notice = isDevStore() ? await devCreateNotice(payload) : await Notice.create(payload);
    res.status(201).json({ notice });
  } catch (error) {
    next(error);
  }
};

export const createAdminFAQ = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const payload = { question, answer, category: category || "General" };
    const faq = isDevStore() ? await devCreateFAQ(payload) : await FAQ.create(payload);
    res.status(201).json({ faq });
  } catch (error) {
    next(error);
  }
};

export const createAdminScholarship = async (req, res, next) => {
  try {
    const { name, description, amount, deadline, eligibility } = req.body;

    if (!name || !description || !amount || !deadline || !eligibility) {
      return res.status(400).json({ message: "All scholarship fields are required" });
    }

    const payload = { name, description, amount, deadline, eligibility };
    const scholarship = isDevStore() ? await devCreateScholarship(payload) : await Scholarship.create(payload);
    res.status(201).json({ scholarship });
  } catch (error) {
    next(error);
  }
};
