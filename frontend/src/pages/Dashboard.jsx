import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Code2, 
  Brain, 
  LogOut, 
  User, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock initial scores (these will hook up to live API metrics in our next step)
  const [metrics] = useState({
    resumeScore: 78,
    dsaProgress: 45,
    aptitudeScore: 62,
    overallReadiness: 61
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex">
      
      {/* 1. SIDE NAVIGATION BAR */}
      <aside className="w-64 bg-darkCard border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 bg-brandIndigo rounded-xl flex items-center justify-center text-white font-bold text-lg">
              I
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              InstantPrep
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brandIndigo text-white font-medium transition-all">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button 
            onClick={() => navigate('/resume')}className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <FileText size={18} />
              <span>Resume Analyzer</span>
            </button>
            <button 
            onClick={() => navigate('/dsa')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <Code2 size={18} />
              <span>DSA Tracker</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <Brain size={18} />
              <span>Aptitude Coach</span>
            </button>
          </nav>
        </div>

        {/* User Footer Profile Summary */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 border border-slate-700">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{user?.name || "Candidate"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.target_role || "Software Engineer"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT REGION */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* Welcome Header Banner */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {user?.name || "Developer"} 👋</h1>
            <p className="text-slate-400 mt-1">Here is your preparation baseline analysis for the week.</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 px-4 py-2 rounded-xl text-sm text-slate-300">
            Targeting: <span className="text-brandIndigo font-semibold">{user?.target_role || "Full Stack Developer"}</span>
          </div>
        </header>

        {/* 3. PERFORMANCE GRID SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Core Tracking Analytics */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Horizontal Metric Cards Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Resume Card */}
              <div className="bg-darkCard border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <span className="text-2xl font-bold text-white">{metrics.resumeScore}%</span>
                </div>
                <h3 className="text-slate-300 font-medium text-sm">Resume ATS Rating</h3>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${metrics.resumeScore}%` }}></div>
                </div>
              </div>

              {/* DSA Progress Card */}
              <div className="bg-darkCard border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-brandIndigo/10 text-brandIndigo rounded-xl">
                    <Code2 size={20} />
                  </div>
                  <span className="text-2xl font-bold text-white">{metrics.dsaProgress}%</span>
                </div>
                <h3 className="text-slate-300 font-medium text-sm">DSA Problem Metrics</h3>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-brandIndigo h-full rounded-full" style={{ width: `${metrics.dsaProgress}%` }}></div>
                </div>
              </div>

              {/* Aptitude Card */}
              <div className="bg-darkCard border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Brain size={20} />
                  </div>
                  <span className="text-2xl font-bold text-white">{metrics.aptitudeScore}%</span>
                </div>
                <h3 className="text-slate-300 font-medium text-sm">Aptitude Score</h3>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${metrics.aptitudeScore}%` }}></div>
                </div>
              </div>

            </div>

            {/* Quick Action Matrix Panel */}
            <div className="bg-darkCard border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recommended Next Steps</h2>
              <div className="divide-y divide-slate-800">
                <div className="py-3.5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-slate-500" />
                    <span className="text-sm text-slate-200 group-hover:text-brandIndigo transition-colors">Your resume is missing keywords for {user?.target_role}. Run an AI audit scan.</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="py-3.5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-slate-500" />
                    <span className="text-sm text-slate-200 group-hover:text-brandIndigo transition-colors">Solve 3 more Medium level Array problems to lock down foundation stats.</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>

          {/* Placement Assessment Score Gauge Sidebar */}
          <div className="bg-darkCard border border-slate-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
            <div className="w-full">
              <h2 className="text-lg font-bold text-white mb-1">Placement Readiness</h2>
              <p className="text-xs text-slate-400 mb-6">Aggregate evaluation metric calculation</p>
              
              {/* Radial Score Presentation Structure */}
              <div className="relative h-40 w-40 mx-auto flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * metrics.overallReadiness) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black text-white">{metrics.overallReadiness}%</span>
                  <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">Ready Index</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5"><Award size={14} /> Global Rank</span>
                <span className="text-white font-semibold">Top 12%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5"><TrendingUp size={14} /> Velocity Index</span>
                <span className="text-emerald-400 font-semibold">+8.4% this week</span>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}