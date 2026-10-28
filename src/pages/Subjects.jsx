// Subjects.jsx — CS Fundamentals page (the user adds their own subjects; saved in MySQL)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const EMPTY_FORM = { name: "", total: "10" };

function Subjects() {
  const { initial } = useUser();
  const [subjects, setSubjects]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  async function load() {
    try { setSubjects(await api("/subjects")); }
    catch (err) { alert(err.message); }
  }
  useEffect(() => { load(); }, []);

  async function saveSubject() {
    if (!form.name.trim()) return;
    try {
      await api("/subjects", "POST", { name: form.name, total: Number(form.total) });
      setForm(EMPTY_FORM);
      setShowModal(false);
      load();
    } catch (err) { alert(err.message); }
  }

  // change = +1 or -1 completed topic
  async function change(s, change) {
    await api("/subjects/" + s.id, "PUT", { done: s.done + change });
    load();
  }
  async function deleteSubject(id) {
    await api("/subjects/" + id, "DELETE");
    load();
  }

  const inputCls = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Subjects</h2><p className="text-xs text-slate-400">Core technical preparation</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="flex justify-between items-center mb-6">
            <div><h1 className="text-2xl font-bold text-slate-100">CS Fundamentals</h1><p className="text-slate-400 text-sm mt-1">Prepare subjects commonly asked in technical interviews.</p></div>
            <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Subject</button>
          </div>

          {subjects.length === 0 && (
            <p className="text-sm text-slate-500">No subjects yet. Click "+ Add Subject" (for example DBMS, OS, CN) and track the topics you complete.</p>
          )}

          <section className="grid grid-cols-2 gap-4">
            {subjects.map((s) => {
              const pct = Math.round((s.done / s.total) * 100);
              return (
                <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-slate-100">{s.name}</h2>
                    <div className="flex items-center gap-3">
                      <strong className="text-purple-400">{pct}%</strong>
                      <button onClick={() => deleteSubject(s.id)} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: pct + "%" }} />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-400">{s.done} of {s.total} topics completed</p>
                    <div className="flex gap-2">
                      <button onClick={() => change(s, -1)} className="w-7 h-7 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600">−</button>
                      <button onClick={() => change(s, 1)} className="w-7 h-7 rounded-lg bg-indigo-500/30 text-purple-300 hover:bg-indigo-500/50">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Add Subject</h2>
            <label className="text-xs text-slate-400 mb-1 block">Subject name</label>
            <input className={inputCls + " mb-3"} placeholder="e.g. DBMS" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="text-xs text-slate-400 mb-1 block">Total topics to complete</label>
            <input type="number" min="1" max="200" className={inputCls} value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
            <button onClick={saveSubject} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm">Save Subject</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Subjects;
