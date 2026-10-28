// Dashboard.jsx — Home page (all numbers come from the database)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { Link } from "react-router-dom";
import { api } from "../api";

// Reusable small components to keep code short
function Card({ children, className = "" }) {
  return <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 ${className}`}>{children}</div>;
}
function ProgressBar({ pct }) {
  return (
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: pct + "%" }} />
    </div>
  );
}

function Dashboard() {
  const { name, initial } = useUser();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [newTask, setNewTask] = useState("");

  // Load tasks + stats from the backend
  async function load() {
    try {
      const [t, s] = await Promise.all([api("/tasks"), api("/stats")]);
      setTasks(t);
      setStats(s);
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => { load(); }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await api("/tasks", "POST", { text: newTask });
      setNewTask("");
      load();
    } catch (err) { alert(err.message); }
  }
  async function toggleTask(t) {
    await api("/tasks/" + t.id, "PUT", { done: !t.done });
    load();
  }
  async function deleteTask(id) {
    await api("/tasks/" + id, "DELETE");
    load();
  }

  if (!stats) return <div className="min-h-screen bg-slate-900 text-slate-400 p-10">Loading...</div>;

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = [
    { label: "DSA", pct: stats.dsa },
    { label: "Core Subjects", pct: stats.subjects },
    { label: "Aptitude", pct: stats.aptitude },
    { label: "Goals", pct: stats.goals },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Dashboard</h2><p className="text-xs text-slate-400">Your placement preparation overview</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="mb-6"><h1 className="text-2xl font-bold text-slate-100">Welcome back, {name} 👋</h1><p className="text-slate-400 text-sm mt-1">Here is your current preparation status.</p></div>

          {/* Stat Cards */}
          <section className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: "Overall Readiness", val: stats.overall + "%", extra: <ProgressBar pct={stats.overall} /> },
              { label: "DSA Problems", val: `${stats.problemsSolved} / ${stats.problemsTotal}`, extra: <span className="text-xs text-slate-400">{stats.problemsTotal - stats.problemsSolved} remaining</span> },
              { label: "Goals Completed", val: `${stats.goalsDone} / ${stats.goalsTotal}`, extra: <span className="text-xs text-slate-400">Keep going</span> },
              { label: "Tasks Done", val: `${doneCount} / ${tasks.length}`, extra: <span className="text-xs text-slate-400">Today's list</span> },
            ].map((s) => (
              <Card key={s.label}><p className="text-xs text-slate-400">{s.label}</p><h2 className="text-2xl font-bold text-slate-100 mt-1">{s.val}</h2>{s.extra}</Card>
            ))}
          </section>

          {/* Tasks + Activity */}
          <section className="grid grid-cols-2 gap-5 mb-5">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-slate-100">Today's Tasks</h2>
                <span className="text-xs text-slate-400">{doneCount}/{tasks.length} completed</span>
              </div>

              <form onSubmit={addTask} className="flex gap-2 mb-3">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a task..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 rounded-lg text-sm font-semibold">Add</button>
              </form>

              <div className="flex flex-col gap-2">
                {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet. Add your first one above.</p>}
                {tasks.map((t) => (
                  <div key={t.id} className="flex gap-3 items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                    <input type="checkbox" checked={!!t.done} onChange={() => toggleTask(t)} className="accent-purple-500 cursor-pointer" />
                    <span className={"flex-1 " + (t.done ? "line-through text-slate-500" : "")}>{t.text}</span>
                    <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="font-semibold text-slate-100 mb-4">Recent Activity</h2>
              {stats.recent.length === 0 && <p className="text-sm text-slate-500">Add problems in the DSA Tracker to see activity here.</p>}
              {stats.recent.map((a, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_75px] gap-2 py-2 border-b border-slate-700 text-sm last:border-0">
                  <strong className="text-indigo-400 truncate">{a.topic}</strong>
                  <span className="text-slate-300">{a.status === "Solved" ? "Solved" : "Added"} {a.name}</span>
                  <small className="text-slate-500 text-right">{new Date(a.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </Card>
          </section>

          {/* Preparation Progress */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-100">Preparation Progress</h2>
              <Link to="/placement" className="text-indigo-400 text-sm">View details →</Link>
            </div>
            {progress.map((p) => (
              <div key={p.label} className="grid grid-cols-[120px_1fr_45px] items-center gap-3 mt-3 text-sm text-slate-300">
                <span>{p.label}</span>
                <ProgressBar pct={p.pct} />
                <strong className="text-right text-purple-400">{p.pct}%</strong>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
}
export default Dashboard;
