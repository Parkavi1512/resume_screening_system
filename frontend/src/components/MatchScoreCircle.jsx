import React from "react";

export default function MatchScoreCircle({ score = 0, size = 120, label = "Match Score" }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#16a34a" : score >= 50 ? "#2563eb" : score >= 30 ? "#f59e0b" : "#e11d48";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="10"
          fill="none" className="text-slate-200 dark:text-slate-800" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="10" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text
          x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-slate-800 dark:fill-white font-extrabold"
          style={{ fontSize: size * 0.22 }}
        >
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
