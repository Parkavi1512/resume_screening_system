import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pencil, MapPin, DollarSign, GraduationCap, Briefcase, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data.data);
    } catch {
      toast.error("Job not found");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchRanking = async () => {
    setRanking(true);
    try {
      const { data } = await api.post("/ai/matchCandidate", { jobId: id });
      setRanked(data.data);
    } catch {
      toast.error("Failed to load candidate ranking");
    } finally {
      setRanking(false);
    }
  };

  useEffect(() => { fetchJob(); fetchRanking(); }, [id]);

  if (loading) return <Layout><div className="skeleton h-96 w-full" /></Layout>;
  if (!job) return null;

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{job.title}</h1>
          <p className="text-slate-500">{job.company}</p>
        </div>
        <Link to={`/jobs/${id}/edit`} className="btn-secondary"><Pencil size={16} /> Edit Job</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
              {job.location && <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>}
              {job.salary && <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>}
              {job.experience && <span className="flex items-center gap-1"><Briefcase size={14} /> {job.experience}</span>}
              {job.education && <span className="flex items-center gap-1"><GraduationCap size={14} /> {job.education}</span>}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.skillsRequired?.map((s) => (
                <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{s}</span>
              ))}
            </div>

            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line mb-4">{job.description}</p>

            {job.responsibilities && (
              <>
                <h3 className="font-bold mb-2">Responsibilities</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.responsibilities}</p>
              </>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="font-bold">Candidate Leaderboard</h3>
          </div>
          {ranking ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
          ) : ranked.length === 0 ? (
            <p className="text-sm text-slate-400">No candidates analyzed for this job yet. Upload resumes and run AI analysis against this job.</p>
          ) : (
            <div className="space-y-2">
              {ranked.map((r) => (
                <Link key={r._id} to={`/resumes/${r.resume?._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">{r.rank}</span>
                    <span className="text-sm font-medium truncate">{r.resume?.name || "Unnamed"}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-600 shrink-0 ml-2">{r.overallMatchScore}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
