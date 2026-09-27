const asyncHandler = require("express-async-handler");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const AIAnalysis = require("../models/AIAnalysis");
const { analyzeResumeAgainstJob } = require("../services/geminiService");

// @route POST /api/ai/analyzeResume
// body: { resumeId, jobId }
const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;
  if (!resumeId || !jobId) {
    res.status(400);
    throw new Error("resumeId and jobId are required");
  }

  const [resume, job] = await Promise.all([
    Resume.findOne({ _id: resumeId, recruiter: req.user._id }),
    Job.findOne({ _id: jobId, recruiter: req.user._id }),
  ]);

  if (!resume) { res.status(404); throw new Error("Resume not found"); }
  if (!job) { res.status(404); throw new Error("Job not found"); }

  const result = await analyzeResumeAgainstJob(resume.rawText, job);

  const analysis = await AIAnalysis.findOneAndUpdate(
    { resume: resume._id, job: job._id },
    { ...result, resume: resume._id, job: job._id, recruiter: req.user._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  resume.status = "analyzed";
  resume.job = job._id;
  await resume.save();

  res.json({ success: true, data: analysis });
});

// @route POST /api/ai/matchCandidate
// body: { jobId } -> ranks all analyzed resumes for this recruiter against a job
const matchCandidate = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    res.status(400);
    throw new Error("jobId is required");
  }

  const job = await Job.findOne({ _id: jobId, recruiter: req.user._id });
  if (!job) { res.status(404); throw new Error("Job not found"); }

  const analyses = await AIAnalysis.find({ job: job._id, recruiter: req.user._id })
    .populate("resume", "name email phone skills fileName")
    .sort({ overallMatchScore: -1 });

  const ranked = analyses.map((a, idx) => ({ rank: idx + 1, ...a.toObject() }));

  res.json({ success: true, data: ranked });
});

module.exports = { analyzeResume, matchCandidate };
