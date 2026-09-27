const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const AIAnalysis = require("../models/AIAnalysis");
const { extractTextFromPDF, parseResumeText } = require("../services/pdfParserService");

// @route POST /api/resumes/upload
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("A PDF resume file is required");
  }

  const filePath = req.file.path;
  let rawText = "";
  try {
    rawText = await extractTextFromPDF(filePath);
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(422);
    throw new Error("Could not parse the uploaded PDF. Please upload a valid PDF resume.");
  }

  const parsed = parseResumeText(rawText);

  const resume = await Resume.create({
    recruiter: req.user._id,
    job: req.body.jobId || null,
    fileName: req.file.originalname,
    filePath: filePath,
    rawText,
    ...parsed,
    status: "parsed",
  });

  res.status(201).json({ success: true, data: resume });
});

// @route GET /api/resumes
const getResumes = asyncHandler(async (req, res) => {
  const { search, job, page = 1, limit = 12, sort = "-createdAt" } = req.query;
  const query = { recruiter: req.user._id };
  if (job) query.job = job;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [resumes, total] = await Promise.all([
    Resume.find(query).sort(sort).skip(skip).limit(Number(limit)),
    Resume.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: resumes,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// @route GET /api/resumes/:id (includes AI analysis if present)
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  const analyses = await AIAnalysis.find({ resume: resume._id }).populate("job", "title company");
  res.json({ success: true, data: { resume, analyses } });
});

// @route DELETE /api/resumes/:id
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  if (resume.filePath && fs.existsSync(resume.filePath)) {
    fs.unlink(resume.filePath, () => {});
  }
  await AIAnalysis.deleteMany({ resume: resume._id });
  res.json({ success: true, message: "Resume deleted" });
});

module.exports = { uploadResume, getResumes, getResumeById, deleteResume };
