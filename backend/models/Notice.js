import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    originalText: {
      type: String,
      default: ""
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    deadlines: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    eligibility: {
      type: [String],
      default: []
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fileUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
