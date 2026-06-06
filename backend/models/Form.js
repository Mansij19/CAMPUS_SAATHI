import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      default: ""
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

export default Form;
