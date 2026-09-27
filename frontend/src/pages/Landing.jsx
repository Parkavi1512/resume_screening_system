import React from "react";
import { Link } from "react-router-dom";
import {
  ScanSearch,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Trophy,
  Upload,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description:
      "Gemini AI compares every resume against your job description and returns a weighted match score in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Compatibility Scoring",
    description:
      "See exactly how a resume performs against real Applicant Tracking Systems before you shortlist a candidate.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track pipeline health, skill gaps, and hiring trends across every job you're screening for.",
  },
  {
    icon: Trophy,
    title: "Candidate Leaderboard",
    description:
      "Automatically rank every analyzed resume for a role, so your best-fit candidates rise to the top.",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Upload resumes",
    description: "Drop in PDF resumes for any role you're hiring for.",
  },
  {
    icon: Sparkles,
    title: "Run AI analysis",
    description: "Gemini AI scores each resume against your job description.",
  },
  {
    icon: Trophy,
    title: "Shortlist top matches",
    description: "Review ranked candidates and move the best ones forward.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/60 dark:bg-slate-950/60 border-b border-white/40 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-extrabold text-xl">
            <ScanSearch size={24} /> ResumeIQ
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center animate-fadeIn">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1 mb-6">
          <Sparkles size={14} /> Powered by Gemini AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight max-w-3xl mx-auto">
          Screen resumes in seconds, not hours
        </h1>
        <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          ResumeIQ uses AI to match candidates against your job descriptions,
          score ATS compatibility, and surface your best-fit hires — all in
          one recruiter dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-card p-6 animate-fadeIn">
              <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, description }, idx) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 font-bold">
                  {idx + 1}
                </div>
                <div className="flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
          Ready to hire faster?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-7">
          Create your recruiter account and run your first AI analysis in
          minutes.
        </p>
        <Link to="/register" className="btn-primary px-6 py-3 text-base">
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/40 dark:border-slate-800/60 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <ScanSearch size={16} /> ResumeIQ — AI-powered resume screening
        </div>
      </footer>
    </div>
  );
}
