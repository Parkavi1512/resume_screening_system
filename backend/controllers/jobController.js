const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");

// @route GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = { recruiter: req.user._id };
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: jobs,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// @route GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json({ success: true, data: job });
});

// @route POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const {
    title, company, skillsRequired, experience, education,
    responsibilities, location, salary, description,
  } = req.body;

  if (!title || !company || !description) {
    res.status(400);
    throw new Error("Title, company and description are required");
  }

  const job = await Job.create({
    recruiter: req.user._id,
    title, company,
    skillsRequired: Array.isArray(skillsRequired)
      ? skillsRequired
      : (skillsRequired || "").split(",").map((s) => s.trim()).filter(Boolean),
    experience, education, responsibilities, location, salary, description,
  });

  res.status(201).json({ success: true, data: job });
});

// @route PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const fields = [
    "title", "company", "experience", "education",
    "responsibilities", "location", "salary", "description", "status",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  });

  if (req.body.skillsRequired !== undefined) {
    job.skillsRequired = Array.isArray(req.body.skillsRequired)
      ? req.body.skillsRequired
      : req.body.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean);
  }

  await job.save();
  res.json({ success: true, data: job });
});

// @route DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json({ success: true, message: "Job deleted" });
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
