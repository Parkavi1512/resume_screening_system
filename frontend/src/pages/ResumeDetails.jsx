import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, Mail, Phone, ArrowLeft, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";
import MatchScoreCircle from "../components/MatchScoreCircle";
import RecommendationBadge from "../components/Badge";

export default function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchData = async () => {
    try {
      const [resRes, jobsRes] = await Promise.all([
        api.get(`/resumes/${id}`),
        api.get("/jobs", { params: { limit: 100 } }),
      ]);
      setResume(resRes.data.data.resume);
      setAnalyses(resRes.data.data.analyses);
      setJobs(jobsRes.data.data);
    } catch {
      toast.error("Resume not found");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const runAnalysis = async () => {
    if (!jobId) { toast.error("Select a job to analyze against"); return; }
    setAnalyzing(true);
    try {
      await api.post("/ai/analyzeResume", { resumeId: id, jobId });
      toast.success("Analysis complete");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <Layout><div className="skeleton h-96 w-full" /></Layout>;
  if (!resume) return null;

  const latest = analyses[0];

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: candidate info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 font-extrabold text-xl">
                {(resume.name || resume.fileName)?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">{resume.name || "Unnamed Candidate"}</h1>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                  {resume.email && <span className="flex items-center gap-1"><Mail size={12} /> {resume.email}</span>}
                  {resume.phone && <span className="flex items-center gap-1"><Phone size={12} /> {resume.phone}</span>}
                </div>
              </div>
            </div>

            <Section title="Skills" items={resume.skills} pill />
            <Section title="Experience" items={resume.experience} />
            <Section title="Education" items={resume.education} />
            <Section title="Projects" items={resume.projects} />
            <Section title="Certifications" items={resume.certifications} />
          </div>
        </div>

        {/* Right: AI analysis */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-3">Run AI Analysis</h3>
            <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="input-field mb-3">
              <option value="">— Select job description —</option>
              {jobs.map((j) => <option key={j._id} value={j._id}>{j.title} · {j.company}</option>)}
            </select>
            <button onClick={runAnalysis} disabled={analyzing} className="btn-primary w-full">
              {analyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {analyzing ? "Analyzing..." : "Analyze with Gemini AI"}
            </button>
          </div>

          {latest && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-4">
                <MatchScoreCircle score={latest.overallMatchScore} />
              </div>
              <div className="flex justify-center mb-4">
                <RecommendationBadge value={latest.recommendation} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center mb-5">
                <MiniStat label="Skill Match" value={latest.technicalSkillMatch} />
                <MiniStat label="Experience" value={latest.experienceMatch} />
                <MiniStat label="Education" value={latest.educationMatch} />
                <MiniStat label="ATS Score" value={latest.atsCompatibilityScore} />
              </div>

              <AnalysisList icon={CheckCircle2} color="text-emerald-500" title="Strengths" items={latest.strengths} />
              <AnalysisList icon={AlertTriangle} color="text-rose-500" title="Missing Skills" items={latest.missingSkills} />
              <AnalysisList icon={AlertTriangle} color="text-amber-500" title="Weaknesses" items={latest.weaknesses} />
              <AnalysisList icon={Lightbulb} color="text-brand-500" title="Improvement Suggestions" items={latest.improvementSuggestions} last />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Section({ title, items, pill }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="font-bold text-sm mb-2">{title}</h3>
      {pill ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((s, i) => <span key={i} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{s}</span>)}
        </div>
      ) : (
        <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
          {items.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl py-3">
      <p className="text-lg font-extrabold text-slate-800 dark:text-white">{value}%</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function AnalysisList({ icon: Icon, color, title, items, last }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={last ? "" : "mb-4"}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Icon size={14} className={`${color} mt-0.5 shrink-0`} /> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
