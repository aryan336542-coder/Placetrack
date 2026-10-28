// Planner.jsx — Weekly Study Planner page (saved in MySQL)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY_FORM = { day: "Monday", subject: "", duration: "1 hour" };

function Planner() {
  const { initial } = useUser();
  const [items, setItems] = useState([]);
  const [form, setForm]   = useState(EMPTY_FORM);

  async function load() {
    try { setItems(await api("/planner")); }
    catch (err) { alert(err.message); }
  }
  useEffect(() => { load(); }, []);

  async function addItem(e) {
    e.preventDefault();
    if (!form.subject.trim()) return;
    try {
      await api("/planner", "POST", form);
      setForm({ ...form, subject: "" });
      load();
    } catch (err) { alert(err.message); }
  }
  async function deleteItem(id) {
    await api("/planner/" + id, "DELETE");
    load();
  }

  const inputCls = "bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Study Planner</h2><p className="text-xs text-slate-400">Plan your preparation week</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="mb-6"><h1 className="text-2xl font-bold text-slate-100">Weekly Study Plan</h1><p className="text-slate-400 text-sm mt-1">Organize your preparation time.</p></div>

          {/* Add form */}
          <form onSubmit={addItem} className="flex gap-3 mb-5 flex-wrap">
            <select className={inputCls} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input className={inputCls + " flex-1 min-w-40"} placeholder="Subject e.g. DSA, DBMS" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <select className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
              {["30 min", "45 min", "1 hour", "1.5 hours", "2 hours"].map((d) => <option key={d}>{d}</option>)}
            </select>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 rounded-lg text-sm font-semibold">+ Add</button>
          </form>

          <section className="grid grid-cols-3 gap-4">
            {DAYS.map((day) => (
              <div key={day} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h2 className="font-semibold text-purple-400 mb-3">{day}</h2>
                {items.filter((i) => i.day === day).map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-t border-slate-700 py-2 text-sm">
                    <b className="text-slate-200">{item.subject}</b>
                    <span className="text-slate-400">
                      {item.duration}
                      <button onClick={() => deleteItem(item.id)} className="ml-2 text-slate-500 hover:text-red-400 text-xs">✕</button>
                    </span>
                  </div>
                ))}
                {items.filter((i) => i.day === day).length === 0 && <p className="text-xs text-slate-500">Nothing planned</p>}
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
export default Planner;
