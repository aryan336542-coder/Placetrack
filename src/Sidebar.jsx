// Sidebar.jsx — Left navigation menu shared on every page
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "./api";

const navLinks = [
  { path: "/",          label: "🏠 Dashboard" },
  { path: "/dsa",       label: "💻 DSA Tracker" },
  { path: "/subjects",  label: "📚 Subjects" },
  { path: "/aptitude",  label: "🧮 Aptitude" },
  { path: "/planner",   label: "📅 Study Planner" },
  { path: "/goals",     label: "🎯 Goals" },
  { path: "/placement", label: "🏢 Placement" },
  { path: "/resources", label: "🔗 Resources" },
  { path: "/profile",   label: "👤 Profile" },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-56 shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col p-4 min-h-screen">
      {/* Logo */}
      <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent px-2 pb-6">
        PlaceTrack
      </h1>
      <p className="text-xs text-slate-500 uppercase tracking-widest px-2 mb-2">Workspace</p>

      {/* Nav Links */}
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === "/"}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg text-sm mb-1 transition-all ` +
            (isActive
              ? "bg-indigo-500/20 text-purple-300 font-semibold border-l-4 border-purple-500 pl-2"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200")
          }
        >
          {link.label}
        </NavLink>
      ))}

      {/* Logout */}
      <button
        onClick={() => {
          clearSession(); // remove token + user
          navigate("/login");
        }}
        className="mt-auto text-left px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
      >
        🚪 Logout
      </button>
    </aside>
  );
}
export default Sidebar;
