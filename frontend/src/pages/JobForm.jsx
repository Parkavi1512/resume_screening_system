import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

const emptyForm = {
  title: "", company: "", skillsRequired: "", experience: "",
  education: "", responsibilities: "", location: "", salary: "", description: "",
};

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        const j = data.data;
        setForm({
          ...j,
          skillsRequired: (j.skillsRequired || []).join(", "),
        });
      } catch {
        toast.error("Failed to load job");
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, form);
        toast.success("Job updated");
      } else {
        await api.post("/jobs", form);
        toast.success("Job created");
      }
      navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Layout><div className="skeleton h-96 w-full max-w-3xl" /></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">
        {isEdit ? "Edit Job" : "Add Job"}
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Fill in the role details recruiters and Gemini AI will match candidates against.
      </p>

      <form onSubmit={submit} className="glass-card p-6 max-w-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Title *</label>
            <input name="title" required value={form.title} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Company *</label>
            <input name="company" required value={form.company} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} className="input-field" placeholder="e.g. $90,000 - $120,000" />
          </div>
          <div>
            <label className="label">Experience Required</label>
            <input name="experience" value={form.experience} onChange={handleChange} className="input-field" placeholder="e.g. 3-5 years" />
          </div>
          <div>
            <label className="label">Education</label>
            <input name="education" value={form.education} onChange={handleChange} className="input-field" placeholder="e.g. Bachelor's in CS" />
          </div>
        </div>

        <div>
          <label className="label">Skills Required (comma separated)</label>
          <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" />
        </div>

        <div>
          <label className="label">Responsibilities</label>
          <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={3} className="input-field" />
        </div>

        <div>
          <label className="label">Job Description *</label>
          <textarea name="description" required value={form.description} onChange={handleChange} rows={6} className="input-field" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 className="animate-spin" size={16} />} {isEdit ? "Save Changes" : "Create Job"}
          </button>
          <button type="button" onClick={() => navigate("/jobs")} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </Layout>
  );
}
