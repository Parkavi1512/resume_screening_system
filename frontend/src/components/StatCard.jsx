import React from "react";

export default function StatCard({ label, value, icon: Icon, accent = "brand", loading }) {
  const accents = {
    brand: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  };

  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${accents[accent]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <div className="skeleton h-6 w-16 mt-1.5" />
        ) : (
          <p className="text-2xl font-extrabold text-slate-800 dark:text-white truncate">{value}</p>
        )}
      </div>
    </div>
  );
}
