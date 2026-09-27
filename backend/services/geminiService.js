const { GoogleGenAI } = require("@google/genai");

let genAI = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }
  if (!genAI) genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return genAI;
}

function buildPrompt(resumeText, job) {
  return `You are an expert technical recruiter and ATS (Applicant Tracking System) engine.
Compare the RESUME against the JOB DESCRIPTION below and return ONLY a valid JSON object
(no markdown fences, no commentary, no extra text) with EXACTLY this shape:

{
  "overallMatchScore": number (0-100),
  "technicalSkillMatch": number (0-100),
  "experienceMatch": number (0-100),
  "educationMatch": number (0-100),
  "atsCompatibilityScore": number (0-100),
  "missingSkills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "improvementSuggestions": string[],
  "recommendation": "Highly Recommended" | "Recommended" | "Not Recommended"
}

JOB TITLE: ${job.title}
COMPANY: ${job.company}
REQUIRED SKILLS: ${(job.skillsRequired || []).join(", ")}
REQUIRED EXPERIENCE: ${job.experience || "Not specified"}
REQUIRED EDUCATION: ${job.education || "Not specified"}
RESPONSIBILITIES: ${job.responsibilities || "Not specified"}
JOB DESCRIPTION:
"""
${job.description}
"""

RESUME TEXT:
"""
${resumeText.slice(0, 15000)}
"""

Scoring guidance:
- overallMatchScore is a weighted holistic score, not a simple average.
- technicalSkillMatch reflects overlap between resume skills and required skills.
- Be specific and concise in arrays (max 8 items each, short phrases).
- recommendation must be exactly one of the three allowed values.
Return ONLY the JSON object.`;
}

function safeParseJSON(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
}

async function analyzeResumeAgainstJob(resumeText, job) {
  const client = getClient();
  const prompt = buildPrompt(resumeText, job);

  const result = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });
  const responseText = result.text;

  let parsed;
  try {
    parsed = safeParseJSON(responseText);
  } catch (err) {
    throw new Error("Failed to parse Gemini response as JSON: " + err.message);
  }

  const clampScore = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
  const allowedRecs = ["Highly Recommended", "Recommended", "Not Recommended"];

  return {
    overallMatchScore: clampScore(parsed.overallMatchScore),
    technicalSkillMatch: clampScore(parsed.technicalSkillMatch),
    experienceMatch: clampScore(parsed.experienceMatch),
    educationMatch: clampScore(parsed.educationMatch),
    atsCompatibilityScore: clampScore(parsed.atsCompatibilityScore),
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 12) : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 12) : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 12) : [],
    improvementSuggestions: Array.isArray(parsed.improvementSuggestions)
      ? parsed.improvementSuggestions.slice(0, 12)
      : [],
    recommendation: allowedRecs.includes(parsed.recommendation)
      ? parsed.recommendation
      : "Not Recommended",
    rawModelResponse: parsed,
  };
}

module.exports = { analyzeResumeAgainstJob };