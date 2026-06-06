import Form from "../models/Form.js";
import { analyzeFormWithGemini } from "../services/formAnalysisService.js";
import { extractTextFromDocument } from "../services/ocrService.js";
import {
  devCreateForm,
  devDeleteForm,
  devFindForm,
  devListForms,
  devUpdateForm,
  isDevStore
} from "../utils/devStore.js";

const fileUrlFor = (file) => `/uploads/${file.filename}`;

export const uploadForm = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload a PDF or image form" });
    }

    const title = req.body.title?.trim() || req.file.originalname;
    const extractedText = await extractTextFromDocument(req.file, title);
    const payload = {
      userId: req.user._id,
      title,
      fileUrl: fileUrlFor(req.file),
      extractedText,
      aiAnalysis: null
    };

    const form = isDevStore() ? await devCreateForm(payload) : await Form.create(payload);
    res.status(201).json({ form });
  } catch (error) {
    next(error);
  }
};

export const analyzeForm = async (req, res, next) => {
  try {
    const formId = req.body.formId || req.params.id;
    if (!formId) {
      return res.status(400).json({ message: "formId is required" });
    }

    const form = isDevStore()
      ? await devFindForm(formId, req.user._id)
      : await Form.findOne({ _id: formId, userId: req.user._id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const aiAnalysis = await analyzeFormWithGemini(form.extractedText, req.user.preferredLanguage);
    const updatedForm = isDevStore()
      ? await devUpdateForm(formId, req.user._id, { aiAnalysis })
      : await Form.findOneAndUpdate({ _id: formId, userId: req.user._id }, { aiAnalysis }, { new: true });

    res.json({ form: updatedForm });
  } catch (error) {
    next(error);
  }
};

export const getFormHistory = async (req, res, next) => {
  try {
    const forms = isDevStore()
      ? await devListForms(req.user._id)
      : await Form.find({ userId: req.user._id }).sort({ uploadedAt: -1 });

    res.json({ forms });
  } catch (error) {
    next(error);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const deleted = isDevStore()
      ? await devDeleteForm(req.params.id, req.user._id)
      : await Form.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Form deleted" });
  } catch (error) {
    next(error);
  }
};
