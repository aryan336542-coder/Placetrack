// Placement.jsx — Placement Readiness page (calculated from your real data)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const tipFor = {
  "DSA":           "Solve more DSA problems and mark them as Solved.",
  "Core Subjects": "Complete more topics in DBMS, OS, CN and OOP.",
  "Aptitude":      "Practice aptitude questions regularly and log your results.",
  "Goals":         "Finish the goals you have set for yourself.",
};

function Placement() {
  const { initial } = useUser();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api("/stats").then(setStats).catch((err) => alert(err.message));
  }, []);

  if (!stats) return <div className="min-h-screen bg-slate-900 text-slate-400 p-10">Loading...</div>;

  const breakdown = [
    { area: "DSA",           score: stats.dsa },
    { area: "Core Subjects", score: stats.subjects },
    { area: "Aptitude",      score: stats.aptitude },
    { area: "Goals",         score: stats.goals },
  ];
  // Recommend the 3 weakest areas first
  const tips = [...breakdown].sort((a, b) => a.score - b.score).slice(0, 3).map((b) => tipFor[b.area]);

  const message =
    stats.overall >= 75 ? "Great work! You are well prepared. Keep revising."
    : stats.overall >= 40 ? "Your preparation is progressing well. Focus on your weakest areas."
    : "You are just getting started. Add problems, practice and goals to build momentum.";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Placement Readiness</h2><p className="text-xs text-slate-400">Overall preparation analysis</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="mb-6"><h1 className="text-2xl font-bold text-slate-100">Placement Preparation</h1><p className="text-slate-400 text-sm mt-1">Your preparation across important placement areas.</p></div>

          {/* Readiness + Breakdown */}
          <section className="grid grid-cols-2 gap-5 mb-5">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="font-semibold text-slate-100">Overall Readiness</h2>
              <div className="text-6xl font-extrabold text-purple-400 my-4">{stats.overall}%</div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: stats.overall + "%" }} />
              </div>
              <p className="text-sm text-slate-400 mt-4">{message}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="font-semibold text-slate-100 mb-3">Area Breakdown</h2>
              {breakdown.map((b) => (
                <div key={b.area} className="flex justify-between border-b border-slate-700 py-2 text-sm last:border-0">
                  <span className="text-slate-300">{b.area}</span>
                  <b className="text-indigo-400">{b.score}%</b>
                </div>
              ))}
            </div>
          </section>

          {/* Focus Tips */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold text-slate-100 mb-3">Recommended Focus</h2>
            {tips.map((tip, i) => <p key={i} className="text-sm text-slate-400 my-2">{i + 1}. {tip}</p>)}
          </div>
        </main>
      </div>
    </div>
  );
}
export default Placement;
