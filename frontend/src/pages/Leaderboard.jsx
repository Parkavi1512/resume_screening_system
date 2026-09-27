import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";
import RecommendationBadge from "../components/Badge";
import { TableRowSkeleton } from "../components/Skeleton";

export default function Leaderboard() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/jobs", { params: { limit: 100 } }).then(({ data }) => {
      setJobs(data.data);
      if (data.data[0]) setJobId(data.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    api.post("/ai/matchCandidate", { jobId })
      .then(({ data }) => setRanked(data.data))
      .catch(() => toast.error("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, [jobId]);

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="text-amber-500" size={24} />
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Candidate Leaderboard</h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ranked by AI match score, skill match, experience and education</p>

      <div className="max-w-xs mb-6">
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="input-field">
          {jobs.length === 0 && <option>No jobs available</option>}
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title} · {j.company}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Match Score</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Education</th>
              <th className="px-4 py-3">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            ) : ranked.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No ranked candidates for this job yet.</td></tr>
            ) : (
              ranked.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold">#{r.rank}</td>
                  <td className="px-4 py-3">
                    <Link to={`/resumes/${r.resume?._id}`} className="font-medium hover:text-brand-600">{r.resume?.name || "Unnamed"}</Link>
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-600">{r.overallMatchScore}%</td>
                  <td className="px-4 py-3">{r.technicalSkillMatch}%</td>
                  <td className="px-4 py-3">{r.experienceMatch}%</td>
                  <td className="px-4 py-3">{r.educationMatch}%</td>
                  <td className="px-4 py-3"><RecommendationBadge value={r.recommendation} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
