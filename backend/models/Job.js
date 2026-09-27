const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Job title is required"], trim: true },
    company: { type: String, required: [true, "Company is required"], trim: true },
    skillsRequired: { type: [String], default: [] },
    experience: { type: String, default: "" }, // e.g. "2-4 years"
    education: { type: String, default: "" },
    responsibilities: { type: String, default: "" },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    description: { type: String, required: [true, "Job description is required"] },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", company: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
