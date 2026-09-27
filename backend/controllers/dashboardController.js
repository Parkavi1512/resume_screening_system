const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const AIAnalysis = require("../models/AIAnalysis");

// @route GET /api/dashboard/summary
const getSummary = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const [totalResumes, totalJobs, analyses, recentResumes] = await Promise.all([
    Resume.countDocuments({ recruiter: recruiterId }),
    Job.countDocuments({ recruiter: recruiterId }),
    AIAnalysis.find({ recruiter: recruiterId }).populate("resume", "name email").populate("job", "title"),
    Resume.find({ recruiter: recruiterId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const avgMatchScore = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + a.overallMatchScore, 0) / analyses.length)
    : 0;

  const topCandidate = analyses.length
    ? analyses.reduce((best, a) => (a.overallMatchScore > (best?.overallMatchScore || 0) ? a : best), null)
    : null;

  res.json({
    success: true,
    data: {
      totalResumes,
      totalJobs,
      totalAnalyses: analyses.length,
      averageMatchScore: avgMatchScore,
      topCandidate,
      recentResumes,
    },
  });
});

// @route GET /api/dashboard/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const recruiterId = new mongoose.Types.ObjectId(req.user._id);

  const [uploadTrends, matchDistribution, topSkills, atsDistribution, recommendationSplit] =
    await Promise.all([
      Resume.aggregate([
        { $match: { recruiter: recruiterId } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      AIAnalysis.aggregate([
        { $match: { recruiter: recruiterId } },
        {
          $bucket: {
            groupBy: "$overallMatchScore",
            boundaries: [0, 20, 40, 60, 80, 101],
            default: "other",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      Resume.aggregate([
        { $match: { recruiter: recruiterId } },
        { $unwind: "$skills" },
        { $group: { _id: "$skills", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AIAnalysis.aggregate([
        { $match: { recruiter: recruiterId } },
        {
          $bucket: {
            groupBy: "$atsCompatibilityScore",
            boundaries: [0, 20, 40, 60, 80, 101],
            default: "other",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      AIAnalysis.aggregate([
        { $match: { recruiter: recruiterId } },
        { $group: { _id: "$recommendation", count: { $sum: 1 } } },
      ]),
    ]);

  res.json({
    success: true,
    data: { uploadTrends, matchDistribution, topSkills, atsDistribution, recommendationSplit },
  });
});

module.exports = { getSummary, getAnalytics };
