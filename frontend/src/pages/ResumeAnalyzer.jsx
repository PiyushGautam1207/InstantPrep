import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  FileText, 
  Code2, 
  Brain, 
  UploadCloud, 
  FileCheck, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Connects directly to our Phase 1 backend file parse system
      const res = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete AI document mining analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-darkCard border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 bg-brandIndigo rounded-xl flex items-center justify-center text-white font-bold text-lg">I</div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">InstantPrep</span>
          </div>
          <nav className="space-y-1.5">
            <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brandIndigo text-white font-medium transition-all">
              <FileText size={18} />
              <span>Resume Analyzer</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <Code2 size={18} />
              <span>DSA Tracker</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <Brain size={18} />
              <span>Aptitude Coach</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Resume Analyzer</h1>
          <p className="text-slate-400 mt-1">Optimize your profile against Applicant Tracking Systems (ATS) for your target role.</p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* CONDITION 1: DISPLAY UPLOAD ZONE IF NO REPORT EXISTS */}
        {!report ? (
          <div className="max-w-3xl bg-darkCard border border-slate-800 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              
              <div className="border-2 border-dashed border-slate-700 hover:border-brandIndigo rounded-xl p-12 text-center relative transition-colors bg-slate-900/20">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={analyzing}
                />
                <div className="flex flex-col items-center justify-center">
                  {file ? (
                    <FileCheck className="h-12 w-12 text-emerald-400 mb-4 animate-bounce" />
                  ) : (
                    <UploadCloud className="h-12 w-12 text-slate-500 mb-4" />
                  )}
                  <p className="text-base font-medium text-slate-200">
                    {file ? file.name : "Drag and drop your resume here, or click to browse"}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Only PDF files are supported at this time</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-sm text-slate-400 flex items-center justify-between">
                <span>Target Role Context Evaluation:</span>
                <span className="text-brandIndigo font-semibold">{user?.target_role || "Full Stack Developer"}</span>
              </div>

              <button
                type="submit"
                disabled={!file || analyzing}
                className="w-full bg-brandIndigo hover:bg-indigo-600 disabled:bg-indigo-500/30 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brandIndigo/10"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Gemini Architecture Extracting Text & Grading Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Analyze with Gemini AI</span>
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          
          /* CONDITION 2: DISPLAY LIVE AI SUMMARY RESULTS REPORT */
          <div className="space-y-8 animate-fadeIn">
            <button 
              onClick={() => { setReport(null); setFile(null); }}
              className="text-sm text-brandIndigo hover:underline mb-4 inline-block"
            >
              ← Upload a different file
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Box 1 */}
              <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl text-center">
                <span className="text-sm text-slate-400 block mb-1">ATS Optimization Rating</span>
                <span className="text-5xl font-black text-emerald-400">{report.ats_score}%</span>
              </div>
              {/* Score Box 2 */}
              <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl text-center">
                <span className="text-sm text-slate-400 block mb-1">Interview Readiness Index</span>
                <span className="text-5xl font-black text-brandIndigo">{report.interview_readiness_score}%</span>
              </div>
              {/* Reset Box 3 */}
              <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center">
                <p className="text-xs text-slate-400 text-center">Your profile was parsed against real-world production resume screening patterns.</p>
              </div>
            </div>

            {/* Strengths & Weaknesses Grid Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-emerald-400">
                  <CheckCircle size={18} /> Foundational Strengths
                </h3>
                <ul className="space-y-2.5">
                  {report.strengths.map((str, i) => (
                    <li key={i} className="text-sm text-slate-300 bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex items-start gap-2">
                      <ChevronRight size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-red-400">
                  <XCircle size={18} /> Structural Vulnerabilities
                </h3>
                <ul className="space-y-2.5">
                  {report.weaknesses.map((weak, i) => (
                    <li key={i} className="text-sm text-slate-300 bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex items-start gap-2">
                      <ChevronRight size={16} className="text-red-400 mt-0.5 shrink-0" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Keyword Missing Analysis Info Box */}
            <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-3">Critical Missing Role Keywords</h3>
              <p className="text-sm text-slate-400 mb-4">Inject these terms into your resume content to clear algorithmic filters for your target role:</p>
              <div className="flex flex-wrap gap-2">
                {report.missing_keywords.map((kw, i) => (
                  <span key={i} className="bg-brandIndigo/10 text-brandIndigo border border-brandIndigo/20 text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Items Text Block */}
            <div className="bg-darkCard border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Architectural Improvement Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
                {report.improvements}
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}