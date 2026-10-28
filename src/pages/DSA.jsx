// DSA.jsx — DSA Tracker page (problems are saved in MySQL)
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const EMPTY_FORM = { name: "", topic: "Arrays", difficulty: "Easy", status: "Pending" };

function DSA() {
  const { initial } = useUser();
  const [problems, setProblems]   = useState([]);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  async function load() {
    try { setProblems(await api("/problems")); }
    catch (err) { alert(err.message); }
  }
  useEffect(() => { load(); }, []);

  const visible = problems.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || p.difficulty === filter)
  );

  async function saveProblem() {
    if (!form.name.trim()) return;
    try {
      await api("/problems", "POST", form);
      setForm(EMPTY_FORM);
      setShowModal(false);
      load();
    } catch (err) { alert(err.message); }
  }

  // Click the status to cycle through Pending, In Progress, Solved and Revision Needed.
  const statuses = ["Pending", "In Progress", "Solved", "Revision Needed"];
  async function toggleStatus(p) {
    const next = statuses[(statuses.indexOf(p.status) + 1) % statuses.length];
    try { await api("/problems/" + p.id, "PUT", { status: next }); load(); }
    catch (err) { alert(err.message); }
  }
  async function deleteProblem(id) {
    await api("/problems/" + id, "DELETE");
    load();
  }

  const solved = problems.filter((p) => p.status === "Solved").length;

  // Topic progress is calculated from the problems list
  const topicNames = [...new Set(problems.map((p) => p.topic))];
  const topics = topicNames.map((name) => {
    const all = problems.filter((p) => p.topic === name);
    const done = all.filter((p) => p.status === "Solved").length;
    return { name, pct: Math.round((done / all.length) * 100) };
  });

  const inputCls = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">DSA Tracker</h2><p className="text-xs text-slate-400">Topic-wise problem solving</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div>
        </header>

        <main className="max-w-5xl mx-auto p-7">
          <div className="flex justify-between items-center mb-6">
            <div><h1 className="text-2xl font-bold text-slate-100">DSA Tracker</h1><p className="text-slate-400 text-sm mt-1">Track solved problems and topic progress.</p></div>
            <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Problem</button>
          </div>

          <section className="grid grid-cols-3 gap-4 mb-5">
            {[["Total Problems", problems.length], ["Solved", solved], ["Remaining", problems.length - solved]].map(([label, val]) => (
              <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-5"><p className="text-xs text-slate-400">{label}</p><h2 className="text-3xl font-bold text-slate-100 mt-1">{val}</h2></div>
            ))}
          </section>

          <div className="flex gap-3 mb-4">
            <input className={inputCls + " max-w-sm"} placeholder="Search problem..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className={inputCls + " w-40"} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Difficulty</option>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-5">
            <h2 className="font-semibold text-slate-100 mb-3">Problem List <span className="text-xs text-slate-500 font-normal">(click a status to cycle through options)</span></h2>
            {visible.length === 0 && <p className="text-sm text-slate-500 py-2">No problems yet. Click "+ Add Problem" to start.</p>}
            {visible.length > 0 && (
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-500 border-b border-slate-700">{["Problem","Topic","Difficulty","Status",""].map((h, i) => <th key={i} className="text-left py-2 px-2">{h}</th>)}</tr></thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 px-2 text-slate-200">{p.name}</td>
                      <td className="py-3 px-2 text-slate-400">{p.topic}</td>
                      <td className="py-3 px-2 text-slate-400">{p.difficulty}</td>
                      <td className="py-3 px-2">
                        <button onClick={() => toggleStatus(p)} className={`font-semibold text-xs ${p.status === "Solved" ? "text-green-400" : p.status === "Revision Needed" ? "text-orange-400" : p.status === "In Progress" ? "text-sky-400" : "text-yellow-400"}`}>{p.status}</button>
                      </td>
                      <td className="py-3 px-2 text-right"><button onClick={() => deleteProblem(p.id)} className="text-slate-500 hover:text-red-400 text-xs">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h2 className="font-semibold text-slate-100 mb-3">Topic Progress</h2>
            {topics.length === 0 && <p className="text-sm text-slate-500">Topic progress appears after you add problems.</p>}
            {topics.map((t) => (
              <div key={t.name} className="grid grid-cols-[120px_1fr_45px] items-center gap-3 mt-3 text-sm text-slate-300">
                <span>{t.name}</span>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: t.pct + "%" }} /></div>
                <strong className="text-right text-purple-400">{t.pct}%</strong>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Add Problem</h2>
            {[
              { label: "Problem Name", key: "name",       type: "input",  placeholder: "e.g. Two Sum" },
              { label: "Topic",        key: "topic",      type: "select", opts: ["Arrays","Strings","Linked List","Trees","Graphs"] },
              { label: "Difficulty",   key: "difficulty", type: "select", opts: ["Easy","Medium","Hard"] },
              { label: "Status",       key: "status",     type: "select", opts: ["Pending","In Progress","Solved","Revision Needed"] },
            ].map(({ label, key, type, opts, placeholder }) => (
              <div key={key} className="mb-3">
                <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                {type === "input"
                  ? <input className={inputCls} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  : <select className={inputCls} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>{opts.map(o => <option key={o}>{o}</option>)}</select>
                }
              </div>
            ))}
            <button onClick={saveProblem} className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm">Save Problem</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DSA;
