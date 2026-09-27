import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobForm from "./pages/JobForm";
import JobDetails from "./pages/JobDetails";
import UploadResume from "./pages/UploadResume";
import Resumes from "./pages/Resumes";
import ResumeDetails from "./pages/ResumeDetails";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: "12px", fontSize: "14px" },
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/jobs/new" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
        <Route path="/jobs/:id/edit" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
        <Route path="/resumes" element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
        <Route path="/resumes/:id" element={<ProtectedRoute><ResumeDetails /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
