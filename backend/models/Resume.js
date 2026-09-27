const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    rawText: { type: String, default: "" },

    // Parsed fields
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    certifications: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["uploaded", "parsed", "analyzed", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

resumeSchema.index({ name: "text", email: "text", skills: "text" });

module.exports = mongoose.model("Resume", resumeSchema);
