// Signup.jsx — New user registration page
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, saveSession } from "../api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e) {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      // Save the new user in MySQL through the backend
      const data = await api("/signup", "POST", { name: form.name, email: form.email, password: form.password });
      saveSession(data.token, data.user); // auto-login after signup
      navigate("/"); // go to Dashboard — everything starts fresh!
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
        <p className="text-center text-slate-400 text-sm mb-8">Start your placement journey today</p>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-slate-100 mb-1">Create Account</h2>
          <p className="text-slate-400 text-sm mb-6">Sign up to track your preparation.</p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                placeholder="Re-enter password"
                value={form.confirm}
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
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
