// Login.jsx — Login page shown to users who are not logged in
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, saveSession } from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault(); // stop page from refreshing

    // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Ask the backend to check email + password
      const data = await api("/login", "POST", form);
      saveSession(data.token, data.user); // ✅ login success — save session
      navigate("/"); // go to Dashboard
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          PlaceTrack
        </h1>
        <p className="text-center text-slate-400 text-sm mb-8">Your placement preparation tracker</p>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-slate-100 mb-1">Welcome back!</h2>
          <p className="text-slate-400 text-sm mb-6">Login to continue your preparation.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm mt-1"
            >
              Login
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
