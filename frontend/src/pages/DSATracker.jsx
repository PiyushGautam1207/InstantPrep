import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DSATracker() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    console.log("Bypassing auth security checks to force loading...");
    fetchDsaData();
  }, []);

  const fetchDsaData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dsa/roadmap');
      if (response.data.success) {
        setRoadmap(response.data.roadmap);
      }
    } catch (err) {
      console.error("Failed to load tracking data from API gateway.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProblem = async (problemId, currentStatus) => {
    try {
      const response = await axios.post('http://localhost:5000/api/dsa/toggle', {
        problem_id: problemId,
        current_status: currentStatus
      });
      
      if (response.data.success) {
        // Dynamic, optimistic UI modification mapping step
        setRoadmap(prevRoadmap => 
          prevRoadmap.map(topic => {
            const hasProblem = topic.problems.some(p => p.id === problemId);
            if (!hasProblem) return topic;

            const updatedProblems = topic.problems.map(p => 
              p.id === problemId ? { ...p, status: response.data.new_status } : p
            );

            return {
              ...topic,
              solved_count: updatedProblems.filter(p => p.status === 'Solved').length,
              problems: updatedProblems
            };
          })
        );
      }
    } catch (err) {
      console.error("Status state update sync failed.", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 font-mono text-emerald-400">
        <div className="animate-pulse tracking-widest text-sm">INITIALIZING DATA STRUCTURE CATALOGS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          DSA TRACKING MATRICES
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-mono">CURRICULUM METHODOLOGY: BLIND 75 COMPILER</p>
      </div>

      <div className="space-y-4 max-w-5xl">
        {roadmap.map((topic) => {
          const isExpanded = expandedTopic === topic.id;
          const completionRatio = topic.total_count > 0 ? (topic.solved_count / topic.total_count) * 100 : 0;

          return (
            <div key={topic.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200">
              <div 
                onClick={() => setExpandedTopic(isExpanded ? null : topic.id)} 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 select-none"
              >
                <div className="flex items-center space-x-4">
                  <h3 className="font-bold tracking-tight text-slate-200 text-base">{topic.name}</h3>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    {topic.solved_count} / {topic.total_count} Solved
                  </span>
                  <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300" style={{ width: `${completionRatio}%` }} />
                  </div>
                  <span className="text-slate-500 font-mono text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-slate-950/40 divide-y divide-slate-800/60">
                  {topic.problems.map((problem) => (
                    <div key={problem.id} className="p-4 flex items-center justify-between hover:bg-slate-900/30">
                      <div className="flex items-center space-x-4">
                        <input 
                          type="checkbox" 
                          checked={problem.status === 'Solved'} 
                          onChange={() => handleToggleProblem(problem.id, problem.status)}
                          className="w-4 h-4 rounded bg-slate-950 text-emerald-500 accent-emerald-500 cursor-pointer"
                        />
                        <a href={problem.leetcode_url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-300 hover:text-emerald-400 hover:underline">
                          {problem.title}
                        </a>
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>{problem.difficulty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}