// Goals.jsx — My Goals page (saved in MySQL)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const EMPTY_FORM = { title: "", period: "Weekly target", progress: "" };

function Goals() {
  const { initial } = useUser();
  const [goals, setGoals]         = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  async function load() {
    try { setGoals(await api("/goals")); }
    catch (err) { alert(err.message); }
  }
  useEffect(() => { load(); }, []);

  async function saveGoal() {
    if (!form.title.trim()) return;
    try {
      await api("/goals", "POST", form);
      setForm(EMPTY_FORM);
      setShowModal(false);
      load();
    } catch (err) { alert(err.message); }
  }
  async function toggleDone(g) {
    await api("/goals/" + g.id, "PUT", { done: !g.done });
    load();
  }
  async function deleteGoal(id) {
    await api("/goals/" + id, "DELETE");
    load();
  }

  const inputCls = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Goals</h2><p className="text-xs text-slate-400">Manage preparation targets</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="flex justify-between items-center mb-6">
            <div><h1 className="text-2xl font-bold text-slate-100">My Goals</h1><p className="text-slate-400 text-sm mt-1">Set daily, weekly and monthly targets.</p></div>
            <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Goal</button>
          </div>

          <div className="flex flex-col gap-3 max-w-2xl">
            {goals.length === 0 && <p className="text-sm text-slate-500">No goals yet. Click "+ Add Goal" to create one.</p>}
            {goals.map((g) => (
              <div key={g.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h3 className={"font-semibold " + (g.done ? "text-slate-500 line-through" : "text-slate-100")}>{g.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{g.period}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${g.done ? "text-green-400" : "text-indigo-400"}`}>{g.done ? "Completed" : g.progress}</span>
                  <button onClick={() => toggleDone(g)} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-lg">{g.done ? "Undo" : "Mark done"}</button>
                  <button onClick={() => deleteGoal(g.id)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Add Goal</h2>
            <label className="text-xs text-slate-400 mb-1 block">Goal</label>
            <input className={inputCls + " mb-3"} placeholder="e.g. Solve 50 DSA problems" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <label className="text-xs text-slate-400 mb-1 block">Period</label>
            <select className={inputCls + " mb-3"} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
              <option>Daily target</option><option>Weekly target</option><option>Monthly target</option>
            </select>
            <label className="text-xs text-slate-400 mb-1 block">Progress note (optional)</label>
            <input className={inputCls} placeholder="e.g. 10 / 50" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
            <button onClick={saveGoal} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm">Save Goal</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Goals;
