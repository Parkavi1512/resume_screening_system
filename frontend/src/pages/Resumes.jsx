import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Users, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";
import { CardSkeleton } from "../components/Skeleton";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchResumes = useCallback(async (q, s, p) => {
    setLoading(true);
    try {
      const { data } = await api.get("/resumes", { params: { search: q, sort: s, page: p, limit: 9 } });
      setResumes(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(search, sort, page); }, [sort, page]);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
    fetchResumes(v, sort, 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success("Resume deleted");
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Candidates</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Search and manage uploaded resumes</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or skill..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field pl-9 pr-8">
            <option value="-createdAt">Latest Upload</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Users size={36} className="mx-auto mb-3 opacity-50" />
          <p>No candidates found. Upload a resume to get started.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <div key={r._id} className="glass-card p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold shrink-0">
                    {(r.name || r.fileName)?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <Link to={`/resumes/${r._id}`} className="font-semibold text-sm hover:text-brand-600 truncate block">
                      {r.name || r.fileName}
                    </Link>
                    <p className="text-xs text-slate-500 truncate">{r.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.skills?.slice(0, 4).map((s) => (
                    <span key={s} className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{s}</span>
                  ))}
                </div>
                <div className="mt-auto flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link to={`/resumes/${r._id}`} className="btn-secondary flex-1 !py-2 text-xs">View Details</Link>
                  <button onClick={() => handleDelete(r._id)} className="btn-danger !py-2 !px-3"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
