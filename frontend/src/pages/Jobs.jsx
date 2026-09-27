import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, MapPin, Briefcase, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";
import { CardSkeleton } from "../components/Skeleton";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs", { params: { search: q } });
      setJobs(data.data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job description? This cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch {
      toast.error("Failed to delete job");
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Job Descriptions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage open roles for candidate matching</p>
        </div>
        <Link to="/jobs/new" className="btn-primary"><Plus size={16} /> Add Job</Link>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); fetchJobs(e.target.value); }}
          placeholder="Search jobs by title or company..."
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Briefcase size={36} className="mx-auto mb-3 opacity-50" />
          <p>No job descriptions yet. Create your first one to start matching candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="glass-card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <Link to={`/jobs/${job._id}`} className="font-bold text-slate-800 dark:text-white hover:text-brand-600">
                  {job.title}
                </Link>
                <span className={`badge ${job.status === "open" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-slate-100 text-slate-500"}`}>
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-3">{job.company}</p>
              {job.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin size={12} /> {job.location}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skillsRequired?.slice(0, 4).map((s) => (
                  <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{s}</span>
                ))}
              </div>
              <div className="mt-auto flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link to={`/jobs/${job._id}`} className="btn-secondary flex-1 !py-2 text-xs">View</Link>
                <Link to={`/jobs/${job._id}/edit`} className="btn-secondary !py-2 !px-3"><Pencil size={14} /></Link>
                <button onClick={() => handleDelete(job._id)} className="btn-danger !py-2 !px-3"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
