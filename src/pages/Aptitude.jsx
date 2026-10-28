// Aptitude.jsx — Aptitude Preparation page (practice results saved in MySQL)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const descriptions = {
  "Quantitative Aptitude": "Percentages, profit and loss, time and work",
  "Logical Reasoning":     "Series, coding, arrangements and puzzles",
  "Verbal Ability":        "Grammar, vocabulary and reading comprehension",
};
const categoryNames = Object.keys(descriptions);
const percent = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

function Aptitude() {
  const { initial } = useUser();
  const [saved, setSaved]         = useState([]);   // rows saved in MySQL (only categories already practiced)
  const [practice, setPractice]     = useState(null); // the category being practiced (or null)
  const [form, setForm]             = useState({ attempted: "", correct: "" });

  async function load() {
    try { setSaved(await api("/aptitude")); }
    catch (err) { alert(err.message); }
  }
  useEffect(() => { load(); }, []);

  async function savePractice() {
    try {
      await api("/aptitude/practice", "POST", {
        category: practice.category,
        attempted: Number(form.attempted),
        correct: Number(form.correct),
      });
      setPractice(null);
      setForm({ attempted: "", correct: "" });
      load();
    } catch (err) { alert(err.message); }
  }

  // Always show the 3 categories; numbers are 0 until the user logs practice
  const categories = categoryNames.map((name) => saved.find((r) => r.category === name) || { id: name, category: name, attempted: 0, correct: 0 });

  const attempted = categories.reduce((sum, c) => sum + c.attempted, 0);
  const correct   = categories.reduce((sum, c) => sum + c.correct, 0);
  const inputCls  = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Aptitude</h2><p className="text-xs text-slate-400">Practice for placement tests</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="mb-6"><h1 className="text-2xl font-bold text-slate-100">Aptitude Preparation</h1><p className="text-slate-400 text-sm mt-1">Track quantitative, logical and verbal preparation.</p></div>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-4 mb-5">
            {[["Questions Attempted", attempted], ["Correct Answers", correct], ["Accuracy", percent(correct, attempted) + "%"]].map(([label, val]) => (
              <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <p className="text-xs text-slate-400">{label}</p>
                <h2 className="text-3xl font-bold text-slate-100 mt-1">{val}</h2>
              </div>
            ))}
          </section>

          {/* Category Cards */}
          <section className="grid grid-cols-2 gap-4">
            {categories.map((c) => {
              const pct = percent(c.correct, c.attempted);
              return (
                <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-slate-100">{c.category}</h2>
                    <strong className="text-purple-400">{pct}%</strong>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: pct + "%" }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">{descriptions[c.category]}</p>
                  <p className="text-xs text-slate-500 mt-1">{c.correct} correct out of {c.attempted} attempted</p>
                  <button onClick={() => setPractice(c)} className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Log Practice</button>
                </div>
              );
            })}
          </section>
        </main>
      </div>

      {practice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-100 mb-1">Log Practice</h2>
            <p className="text-sm text-slate-400 mb-4">{practice.category}</p>
            <label className="text-xs text-slate-400 mb-1 block">Questions attempted</label>
            <input type="number" min="1" className={inputCls + " mb-3"} value={form.attempted} onChange={(e) => setForm({ ...form, attempted: e.target.value })} />
            <label className="text-xs text-slate-400 mb-1 block">Correct answers</label>
            <input type="number" min="0" className={inputCls} value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })} />
            <button onClick={savePractice} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm">Save</button>
            <button onClick={() => setPractice(null)} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Aptitude;
