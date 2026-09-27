const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract raw text from a PDF file on disk.
 */
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text || "";
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;

const SECTION_HEADERS = {
  skills: /(technical skills|skills|core competencies)/i,
  education: /(education|academic background|qualifications)/i,
  experience: /(experience|work experience|employment history|professional experience)/i,
  projects: /(projects|personal projects|academic projects)/i,
  certifications: /(certifications|certificates|licenses)/i,
};

function splitIntoSections(text) {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let currentKey = "header";
  sections[currentKey] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let matchedKey = null;
    for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
      if (trimmed.length < 40 && regex.test(trimmed)) {
        matchedKey = key;
        break;
      }
    }
    if (matchedKey) {
      currentKey = matchedKey;
      if (!sections[currentKey]) sections[currentKey] = [];
      continue;
    }
    if (trimmed) sections[currentKey].push(trimmed);
  }
  return sections;
}

function toBulletList(lines = []) {
  return lines
    .join("\n")
    .split(/\n|•|\u2022/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2)
    .slice(0, 30);
}

/**
 * Lightweight heuristic parser used as a fast, offline first-pass.
 * Gemini is used later for deeper semantic understanding during analysis,
 * but we still want structured fields stored immediately after upload.
 */
function parseResumeText(text) {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);

  const sections = splitIntoSections(text);
  const headerLines = (sections.header || []).filter((l) => l.length > 1);
  const probableName = headerLines.length ? headerLines[0].slice(0, 80) : "";

  const skillsRaw = toBulletList(sections.skills);
  const skills = skillsRaw
    .join(",")
    .split(/,|\|/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 40);

  return {
    name: probableName,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0].trim() : "",
    skills: [...new Set(skills)],
    education: toBulletList(sections.education),
    experience: toBulletList(sections.experience),
    projects: toBulletList(sections.projects),
    certifications: toBulletList(sections.certifications),
  };
}

module.exports = { extractTextFromPDF, parseResumeText };
