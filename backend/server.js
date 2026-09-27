require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is healthy" }));

// Auth: POST /api/auth/register, POST /api/auth/login
app.use("/api/auth", authRoutes);
// Jobs: GET/POST /api/jobs, PUT/DELETE /api/jobs/:id
app.use("/api/jobs", jobRoutes);
// Resumes: POST /api/resumes/upload, GET /api/resumes, GET/DELETE /api/resumes/:id
app.use("/api/resumes", resumeRoutes);
// AI: POST /api/ai/analyzeResume, POST /api/ai/matchCandidate
app.use("/api/ai", aiRoutes);
// Dashboard/analytics
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
