import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, FileUp, Users, Trophy, BarChart3,
  LogOut, Menu, X, ScanSearch,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Job Descriptions", icon: Briefcase },
  { to: "/upload", label: "Upload Resume", icon: FileUp },
  { to: "/resumes", label: "Candidates", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 glass-card m-3 sticky top-3 z-30">
        <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-400">
          <ScanSearch size={22} /> ResumeIQ
        </div>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 lg:top-3 left-0 h-screen lg:h-[calc(100vh-1.5rem)] w-72 lg:ml-3 lg:rounded-2xl z-40 transform transition-transform duration-300 glass-card flex flex-col p-5
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="hidden lg:flex items-center gap-2 font-extrabold text-xl text-brand-700 dark:text-brand-400 mb-8 px-1">
            <ScanSearch size={26} /> ResumeIQ
          </div>

          <nav className="flex-1 space-y-1.5 mt-4 lg:mt-0">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/70"
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200/70 dark:border-slate-800 pt-4 mt-4">
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <ThemeToggle />
            </div>
            <button onClick={handleLogout} className="btn-secondary w-full">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-3 lg:p-6">
          <div className="animate-fadeIn">{children}</div>
        </main>
      </div>
    </div>
  );
}
