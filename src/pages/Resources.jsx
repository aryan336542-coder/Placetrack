import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import useUser from "../useUser";
import { api } from "../api";

const CATEGORIES = ["All", "DSA", "Aptitude", "Core Subjects", "Web Development", "Interview Preparation", "Other"];
const RESOURCE_CATEGORIES = CATEGORIES.filter((c) => c !== "All");
const TYPES = ["Website", "Video", "Article", "Practice"];
const STARTER_RESOURCES = [
  { title: "LeetCode", category: "DSA", type: "Practice", url: "https://leetcode.com/", description: "Practice coding interview problems." },
  { title: "GeeksforGeeks", category: "DSA", type: "Website", url: "https://www.geeksforgeeks.org/", description: "DSA explanations, articles and practice." },
  { title: "IndiaBIX", category: "Aptitude", type: "Practice", url: "https://www.indiabix.com/", description: "Quantitative aptitude, reasoning and verbal practice." },
  { title: "HackerRank", category: "Interview Preparation", type: "Practice", url: "https://www.hackerrank.com/", description: "Coding practice and skill assessments." },
  { title: "MDN Web Docs", category: "Web Development", type: "Article", url: "https://developer.mozilla.org/", description: "Reference guides for HTML, CSS and JavaScript." },
  { title: "InterviewBit", category: "Interview Preparation", type: "Website", url: "https://www.interviewbit.com/", description: "Interview preparation and coding practice." },
];
const EMPTY = { title: "", category: "DSA", resourceType: "Website", url: "", description: "" };

function Resources() {
  const { initial } = useUser();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try { setResources(await api("/resources")); }
    catch (err) { setError(err.message); }
  }
  useEffect(() => { load(); }, []);

  const savedResources = useMemo(() => resources.map((r) => ({ ...r, type: r.resource_type || r.resourceType })), [resources]);
  const visibleSaved = savedResources.filter((r) => filter === "All" || r.category === filter);
  const visibleStarter = STARTER_RESOURCES.filter((r) => filter === "All" || r.category === filter);
  const inputCls = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500";

  async function save(e) {
    e.preventDefault(); setError("");
    try {
      await api("/resources", "POST", form);
      setForm(EMPTY); setShowForm(false); await load();
    } catch (err) { setError(err.message); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this saved resource?")) return;
    try { await api(`/resources/${id}`, "DELETE"); await load(); }
    catch (err) { setError(err.message); }
  }

  function ResourceCard({ resource, removable = false }) {
    return <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col min-h-44">
      <div className="flex items-start justify-between gap-3"><span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-1">{resource.category}</span>{removable && <button onClick={() => remove(resource.id)} className="text-xs text-slate-500 hover:text-red-400">Delete</button>}</div>
      <h3 className="font-semibold text-slate-100 mt-3">{resource.title}</h3>
      <p className="text-sm text-slate-400 mt-2 flex-1">{resource.description || "Saved learning resource."}</p>
      <div className="flex items-center justify-between mt-4 gap-3"><span className="text-xs text-slate-500">{resource.type || resource.resource_type || "Website"}</span><a href={resource.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-300 hover:text-indigo-200">Open resource ↗</a></div>
    </article>;
  }

  return <div className="flex min-h-screen bg-slate-900 text-slate-200"><Sidebar /><div className="flex-1 min-w-0">
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7"><div><h2 className="text-base font-semibold">Learning Resources</h2><p className="text-xs text-slate-400">Keep useful placement-preparation links in one place</p></div><div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{initial}</div></header>
    <main className="max-w-6xl mx-auto p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6"><div><h1 className="text-2xl font-bold text-slate-100">Learning Resources</h1><p className="text-sm text-slate-400 mt-1">Starter links plus your own saved resources.</p></div><button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">{showForm ? "Close form" : "+ Add Resource"}</button></div>
      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {showForm && <form onSubmit={save} className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
        <label className="text-xs text-slate-400">Resource title<input required maxLength="200" className={inputCls + " mt-1"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. DBMS revision notes" /></label>
        <label className="text-xs text-slate-400">URL<input required type="url" className={inputCls + " mt-1"} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></label>
        <label className="text-xs text-slate-400">Category<select className={inputCls + " mt-1"} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{RESOURCE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-xs text-slate-400">Resource type<select className={inputCls + " mt-1"} value={form.resourceType} onChange={(e) => setForm({ ...form, resourceType: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-xs text-slate-400 md:col-span-2">Short description<textarea maxLength="500" rows="2" className={inputCls + " mt-1"} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this resource useful for?" /></label>
        <div className="md:col-span-2"><button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-semibold">Save Resource</button></div>
      </form>}
      <div className="flex flex-wrap gap-2 mb-6">{CATEGORIES.map((c) => <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1.5 text-sm border ${filter === c ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/50" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"}`}>{c}</button>)}</div>
      <section className="mb-8"><div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-slate-100">Recommended Resources</h2><span className="text-xs text-slate-500">Curated starter links</span></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{visibleStarter.map((r) => <ResourceCard key={r.title} resource={r} />)}</div>{visibleStarter.length === 0 && <p className="text-sm text-slate-500">No recommended resources in this category yet.</p>}</section>
      <section><div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-slate-100">My Saved Resources</h2><span className="text-xs text-slate-500">{visibleSaved.length} saved</span></div>{visibleSaved.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{visibleSaved.map((r) => <ResourceCard key={r.id} resource={r} removable />)}</div> : <div className="bg-slate-800/60 border border-dashed border-slate-700 rounded-xl p-8 text-center"><p className="font-medium text-slate-300">No saved resources yet</p><p className="text-sm text-slate-500 mt-1">Use “Add Resource” to save your own notes, videos, and practice links.</p></div>}</section>
    </main></div></div>;
}
export default Resources;
