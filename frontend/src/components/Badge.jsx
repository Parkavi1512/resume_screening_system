import React from "react";

const map = {
  "Highly Recommended": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Recommended": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Not Recommended": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function RecommendationBadge({ value }) {
  if (!value) return null;
  return <span className={`badge ${map[value] || "bg-slate-100 text-slate-600"}`}>{value}</span>;
}
