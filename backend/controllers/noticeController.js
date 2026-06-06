import Notice from "../models/Notice.js";
import { extractTextFromDocument } from "../services/ocrService.js";
import { summarizeNoticeWithGemini } from "../services/noticeSummaryService.js";
import {
  devCreateNotice,
  devDeleteNotice,
  devFindNotice,
  devListNotices,
  devUpdateNotice,
  isDevStore
} from "../utils/devStore.js";

const fileUrlFor = (file) => `/uploads/${file.filename}`;

export const uploadNotice = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload a PDF or image notice" });
    }

    const title = req.body.title?.trim() || req.file.originalname;
    const originalText = await extractTextFromDocument(req.file, title);
    const payload = {
      title,
      originalText,
      summary: null,
      deadlines: [],
      eligibility: [],
      uploadedBy: req.user._id,
      fileUrl: fileUrlFor(req.file)
    };

    const notice = isDevStore() ? await devCreateNotice(payload) : await Notice.create(payload);
    res.status(201).json({ notice });
  } catch (error) {
    next(error);
  }
};

export const summarizeNotice = async (req, res, next) => {
  try {
    const noticeId = req.body.noticeId || req.params.id;
    if (!noticeId) {
      return res.status(400).json({ message: "noticeId is required" });
    }

    const notice = isDevStore()
      ? await devFindNotice(noticeId, req.user._id)
      : await Notice.findOne({ _id: noticeId, uploadedBy: req.user._id });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const summary = await summarizeNoticeWithGemini(notice.originalText, req.user.preferredLanguage);
    const updates = {
      summary,
      deadlines: summary.deadlines || [],
      eligibility: summary.eligibility || []
    };
    const updatedNotice = isDevStore()
      ? await devUpdateNotice(noticeId, req.user._id, updates)
      : await Notice.findOneAndUpdate({ _id: noticeId, uploadedBy: req.user._id }, updates, { new: true });

    res.json({ notice: updatedNotice });
  } catch (error) {
    next(error);
  }
};

export const getNotices = async (req, res, next) => {
  try {
    const notices = isDevStore()
      ? await devListNotices(req.user._id)
      : await Notice.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    res.json({ notices });
  } catch (error) {
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const deleted = isDevStore()
      ? await devDeleteNotice(req.params.id, req.user._id)
      : await Notice.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted" });
  } catch (error) {
    next(error);
  }
};
