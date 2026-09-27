import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ScanSearch, Mail, Lock, User, Building2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      toast.success("Account created!");
      navigate("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8">
      <div className="w-full max-w-md glass-card p-8 animate-fadeIn">
        <div className="flex items-center gap-2 justify-center text-brand-700 dark:text-brand-400 font-extrabold text-2xl mb-1">
          <ScanSearch size={28} /> ResumeIQ
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">
          Create your recruiter account
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10" placeholder="Jane Doe" />
            </div>
          </div>
          <div>
            <label className="label">Company</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="input-field pl-10" placeholder="Acme Inc." />
            </div>
          </div>
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-10" placeholder="you@company.com" />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" required minLength={6} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-10" placeholder="At least 6 characters" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading && <Loader2 className="animate-spin" size={16} />} Create account
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
