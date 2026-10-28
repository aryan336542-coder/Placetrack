// Profile.jsx — loads and saves the profile in MySQL
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { api } from "../api";

function Profile() {
  const [form, setForm] = useState({
    name: "", email: "", college: "", branch: "", year: "", role: "",
    companyType: "Product Based",
    level: "Beginner",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load the saved profile from the backend
  useEffect(() => {
    api("/profile").then(setForm).catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSave() {
    setError("");
    try {
      await api("/profile", "PUT", form);
      // keep the name/email in the header up to date
      localStorage.setItem("placetrack_user", JSON.stringify({ name: form.name, email: form.email }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    }
  }

  const inputCls = "w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 mt-1";
  const userInitial = form.name ? form.name.charAt(0).toUpperCase() : "?";

  const fields = [
    { label: "Full Name",       name: "name",    type: "text",  placeholder: "Your full name" },
    { label: "Email",           name: "email",   type: "email", placeholder: "you@example.com" },
    { label: "College",         name: "college", type: "text",  placeholder: "Your college name" },
    { label: "Branch",          name: "branch",  type: "text",  placeholder: "e.g. Computer Science" },
    { label: "Graduation Year", name: "year",    type: "text",  placeholder: "e.g. 2026" },
    { label: "Target Role",     name: "role",    type: "text",  placeholder: "e.g. Software Developer" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-7">
          <div><h2 className="text-base font-semibold">Profile</h2><p className="text-xs text-slate-400">Your placement information</p></div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">{userInitial}</div>
        </header>

        <main className="max-w-4xl mx-auto p-7">
          <div className="mb-6"><h1 className="text-2xl font-bold text-slate-100">My Profile</h1><p className="text-slate-400 text-sm mt-1">Keep your basic information updated.</p></div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-7">
            {/* Avatar row */}
            <div className="flex items-center gap-4 pb-5 border-b border-slate-700 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-extrabold">
                {userInitial}
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-100">{form.name || "New Student"}</h2>
                <p className="text-sm text-slate-400">{form.college || "Add your college below"}</p>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="text-xs text-slate-400">{f.label}</label>
                  <input className={inputCls} type={f.type} name={f.name} value={form[f.name] || ""} onChange={handleChange} placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400">Target Company Type</label>
                <select className={inputCls} name="companyType" value={form.companyType} onChange={handleChange}>
                  <option>Product Based</option><option>Service Based</option><option>Both</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Preparation Level</label>
                <select className={inputCls} name="level" value={form.level} onChange={handleChange}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg text-sm font-semibold">
                Save Changes
              </button>
              {saved && <span className="text-green-400 text-sm">✓ Changes saved!</span>}
              {error && <span className="text-red-400 text-sm">{error}</span>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default Profile;
