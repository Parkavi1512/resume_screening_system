import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import toast from "react-hot-toast";
import api from "../api/axios";
import Layout from "../components/Layout";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#e11d48", "#7c3aed"];
const BUCKET_LABELS = ["0-19", "20-39", "40-59", "60-79", "80-100"];

function labelBuckets(arr) {
  return (arr || []).map((b, i) => ({ range: BUCKET_LABELS[i] || String(b._id), count: b.count }));
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/analytics")
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">Analytics</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Screening trends across all your candidates and jobs</p>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-72 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Resume Upload Trends">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.uploadTrends.map((d) => ({ date: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Candidate Match Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={labelBuckets(data.matchDistribution)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="range" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Skills">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={data.topSkills.map((s) => ({ skill: s._id, count: s.count }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="skill" fontSize={11} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="ATS Score Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={labelBuckets(data.atsDistribution)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="range" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Recommended vs Rejected" full>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.recommendationSplit.map((r) => ({ name: r._id, value: r.count }))}
                  dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}
                >
                  {data.recommendationSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </Layout>
  );
}

function ChartCard({ title, children, full }) {
  return (
    <div className={`glass-card p-5 ${full ? "lg:col-span-2" : ""}`}>
      <h3 className="font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}
