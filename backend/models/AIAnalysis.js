const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    overallMatchScore: { type: Number, min: 0, max: 100, default: 0 },
    technicalSkillMatch: { type: Number, min: 0, max: 100, default: 0 },
    experienceMatch: { type: Number, min: 0, max: 100, default: 0 },
    educationMatch: { type: Number, min: 0, max: 100, default: 0 },
    atsCompatibilityScore: { type: Number, min: 0, max: 100, default: 0 },

    missingSkills: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementSuggestions: { type: [String], default: [] },

    recommendation: {
      type: String,
      enum: ["Highly Recommended", "Recommended", "Not Recommended"],
      default: "Not Recommended",
    },

    rawModelResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

aiAnalysisSchema.index({ resume: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("AIAnalysis", aiAnalysisSchema);
