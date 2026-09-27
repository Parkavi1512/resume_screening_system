import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function UploadResume() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/jobs", { params: { limit: 100 } }).then(({ data }) => setJobs(data.data));
  }, []);

  const validateAndSetFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const submit = async () => {
    if (!file) { toast.error("Please choose a PDF resume"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobId) formData.append("jobId", jobId);

      const { data } = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const resume = data.data;
      toast.success("Resume parsed successfully");

      if (jobId) {
        setAnalyzing(true);
        try {
          await api.post("/ai/analyzeResume", { resumeId: resume._id, jobId });
          toast.success("AI analysis complete");
        } catch {
          toast.error("Resume saved, but AI analysis failed. You can retry from the resume page.");
        } finally {
          setAnalyzing(false);
        }
      }

      navigate(`/resumes/${resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const busy = uploading || analyzing;

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Upload Resume</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Upload a PDF resume, optionally select a job to run instant AI matching.
      </p>

      <div className="glass-card p-6 max-w-2xl space-y-5">
        <div>
          <label className="label">Match against job (optional)</label>
          <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="input-field">
            <option value="">— Select a job description —</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title} · {j.company}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1.5">
            If selected, Gemini AI will automatically analyze this resume against the job right after upload.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
          ${dragOver ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30" : "border-slate-300 dark:border-slate-700 hover:border-brand-400"}`}
        >
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files?.[0])} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="text-brand-600" size={28} />
              <div className="text-left">
                <p className="font-semibold text-sm">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto text-slate-400 mb-3" size={36} />
              <p className="font-medium text-slate-600 dark:text-slate-300">Drag & drop a PDF resume, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PDF only, max 5MB</p>
            </>
          )}
        </div>

        <button onClick={submit} disabled={busy || !file} className="btn-primary w-full">
          {busy ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {analyzing ? "Running AI analysis..." : uploading ? "Uploading..." : "Upload & Parse Resume"}
        </button>
      </div>
    </Layout>
  );
}
