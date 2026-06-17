import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your context provider
import { AuthProvider } from './context/AuthContext'; 

// Import all your active feature page modules
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import DSATracker from './pages/DSATracker';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Gateway Portal */}
          <Route path="/login" element={<Login />} />

          {/* Flat Workspace Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/dsa" element={<DSATracker />} />

          {/* Fallback & Catch-All Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}