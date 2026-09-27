# ResumeIQ — AI Resume Screening System

A full-stack recruiter tool that parses PDF resumes, matches them against job
descriptions using Google Gemini, and ranks candidates on a leaderboard.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + Recharts + React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API (`gemini-1.5-flash`)
- **Resume parsing:** pdf-parse

## What's implemented
- JWT auth (register/login/protected routes)
- Job CRUD (title, company, skills, experience, education, responsibilities, location, salary, description)
- PDF resume upload with heuristic field extraction (name, email, phone, skills, education, experience, projects, certifications) stored in MongoDB
- Gemini-powered analysis per resume↔job pair: overall score, skill/experience/education match, ATS score, missing skills, strengths, weaknesses, recommendation, improvement suggestions
- Candidate ranking/leaderboard per job
- Dashboard with stat cards + recent uploads + top candidate
- Analytics page with 5 charts (upload trends, match distribution, top skills, ATS distribution, recommendation split)
- Search, sort, and pagination on jobs/resumes
- Responsive blue/white UI with glassmorphism cards, dark mode, toasts, skeleton loaders

## Not fully built out (left as clear extension points)
These were listed as "additional features" in the brief. To keep the delivered
code honest and runnable rather than padded with fake integrations, they're
stubbed rather than fully wired:
- **PDF export of AI analysis** — add a route using a PDF lib (e.g. `pdfkit`) that renders the `AIAnalysis` document.
- **Excel export of shortlisted candidates** — add a route using `exceljs`, feeding it the ranked candidate list from `/api/ai/matchCandidate`.
- **Emailing shortlisted candidates** — add `nodemailer` with SMTP credentials in `.env`, then a controller that emails `resume.email`.

Each of these is a self-contained addition (one new dependency + one new route) and slots cleanly into the existing `controllers/`/`routes/` structure.

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev      # starts on http://localhost:5000
```
Get a Gemini API key at https://aistudio.google.com/app/apikey — the free tier is enough for testing.

Make sure MongoDB is running locally (`mongod`) or point `MONGO_URI` at an Atlas cluster.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```
The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no CORS config is needed in development.

### 3. Try it
1. Register a recruiter account at `/register`
2. Add a job description
3. Upload a PDF resume (optionally pick the job to auto-run AI analysis)
4. View the candidate's match score, missing skills, and recommendation
5. Check `/leaderboard` and `/analytics` for aggregate views

## API Reference
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create recruiter account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user (protected) |
| GET | `/api/jobs` | List jobs (search, pagination) |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs/:id` | Job details |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/resumes/upload` | Upload + parse PDF resume (`multipart/form-data`, field `resume`) |
| GET | `/api/resumes` | List resumes (search, sort, pagination) |
| GET | `/api/resumes/:id` | Resume + its AI analyses |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/ai/analyzeResume` | `{ resumeId, jobId }` → Gemini analysis |
| POST | `/api/ai/matchCandidate` | `{ jobId }` → ranked candidate list |
| GET | `/api/dashboard/summary` | Dashboard stat cards |
| GET | `/api/dashboard/analytics` | Chart data |

All routes except register/login require `Authorization: Bearer <token>`.

## MongoDB Collections
`users`, `jobs`, `resumes`, `aianalyses` — schemas in `backend/models/`.

## Project Structure
```
backend/
  config/db.js
  controllers/        (auth, job, resume, ai, dashboard)
  middleware/          (auth, upload, errorHandler)
  models/               (User, Job, Resume, AIAnalysis)
  routes/
  services/            (geminiService, pdfParserService)
  utils/generateToken.js
  server.js
frontend/
  src/
    api/axios.js
    context/AuthContext.jsx
    components/         (Layout, StatCard, MatchScoreCircle, Badge, Skeleton, ProtectedRoute, ThemeToggle)
    pages/               (Login, Register, Dashboard, Jobs, JobForm, JobDetails, UploadResume, Resumes, ResumeDetails, Leaderboard, Analytics)
```

Both `backend` and `frontend` were installed and built successfully in this environment (`npm run build` passes with no errors) before packaging.
