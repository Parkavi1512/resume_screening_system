import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Trophy, Percent, ArrowUpRight } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { CardSkeleton } from "../components/Skeleton";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/dashboard/summary");
        setSummary(data.data);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Overview of your resume screening activity
          </p>
        </div>
        <Link to="/upload" className="btn-primary hidden sm:inline-flex">
          Upload Resume
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Resumes" value={summary?.totalResumes ?? 0} icon={FileText} accent="brand" loading={loading} />
        <StatCard label="Job Descriptions" value={summary?.totalJobs ?? 0} icon={Briefcase} accent="violet" loading={loading} />
        <StatCard label="Avg Match Score" value={`${summary?.averageMatchScore ?? 0}%`} icon={Percent} accent="amber" loading={loading} />
        <StatCard
          label="Top Candidate"
          value={summary?.topCandidate?.resume?.name || "—"}
          icon={Trophy} accent="emerald" loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white">Recently Uploaded Resumes</h2>
            <Link to="/resumes" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : summary?.recentResumes?.length ? (
            <div className="space-y-2">
              {summary.recentResumes.map((r) => (
                <Link
                  key={r._id} to={`/resumes/${r._id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{r.name || r.fileName}</p>
                    <p className="text-xs text-slate-500 truncate">{r.email || "No email extracted"}</p>
                  </div>
                  <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 capitalize shrink-0 ml-3">
                    {r.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <div className="glass-card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Top Matching Candidate</h2>
          {loading ? (
            <CardSkeleton />
          ) : summary?.topCandidate ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 font-extrabold text-xl mb-3">
                {summary.topCandidate.resume?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <p className="font-bold">{summary.topCandidate.resume?.name}</p>
              <p className="text-xs text-slate-500 mb-3">{summary.topCandidate.job?.title}</p>
              <p className="text-3xl font-extrabold text-brand-600">{summary.topCandidate.overallMatchScore}%</p>
              <p className="text-xs text-slate-500">match score</p>
            </div>
          ) : (
            <EmptyState small />
          )}
        </div>
      </div>
    </Layout>
  );
}

function EmptyState({ small }) {
  return (
    <div className={`text-center text-slate-400 ${small ? "py-6" : "py-12"}`}>
      <p className="text-sm">No data yet. Upload a resume and run AI analysis to see insights here.</p>
    </div>
  );
}
