// server.js — PlaceTrack backend (Express + MySQL). Simple and beginner friendly.
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool, initDatabase } = require("./db");

const app = express();
const SECRET = process.env.JWT_SECRET || "placetrack_dev_secret";

app.use(cors());
app.use(express.json());

// ---------- small helpers ----------

// Wraps a route so any error becomes a clean JSON message (no try/catch everywhere)
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Server error. Check the server terminal." });
  });

// Login check: reads the token sent by React and finds the user id
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Please login first." });
  try {
    req.userId = jwt.verify(token, SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please login again." });
  }
}

const makeToken = (id) => jwt.sign({ id }, SECRET, { expiresIn: "7d" });

// The only aptitude categories the app accepts
const APTITUDE_CATEGORIES = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"];
const RESOURCE_CATEGORIES = ["DSA", "Aptitude", "Core Subjects", "Web Development", "Interview Preparation", "Other"];
const RESOURCE_TYPES = ["Website", "Video", "Article", "Practice"] ;

// ---------- AUTH ----------

app.post("/api/signup", wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Please fill in all fields." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const cleanEmail = email.trim().toLowerCase();
  const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
  if (exists.length > 0) return res.status(400).json({ error: "This email is already registered." });

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name.trim(), cleanEmail, hash]
  );
  const id = result.insertId; // new users start with completely empty data

  res.json({ token: makeToken(id), user: { name: name.trim(), email: cleanEmail } });
}));

app.post("/api/login", wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Please fill in all fields." });

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: "Incorrect email or password." });

  res.json({ token: makeToken(user.id), user: { name: user.name, email: user.email } });
}));

// ---------- PROFILE ----------

app.get("/api/profile", auth, wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT name, email, college, branch, grad_year AS year, target_role AS role,
            company_type AS companyType, level FROM users WHERE id = ?`, [req.userId]);
  res.json(rows[0]);
}));

app.put("/api/profile", auth, wrap(async (req, res) => {
  const { name, email, college, branch, year, role, companyType, level } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });

  const cleanEmail = email.trim().toLowerCase();
  const [taken] = await pool.query("SELECT id FROM users WHERE email = ? AND id <> ?", [cleanEmail, req.userId]);
  if (taken.length > 0) return res.status(400).json({ error: "This email is used by another account." });

  await pool.query(
    `UPDATE users SET name=?, email=?, college=?, branch=?, grad_year=?, target_role=?, company_type=?, level=?
     WHERE id=?`,
    [name.trim(), cleanEmail, college || "", branch || "", year || "", role || "", companyType, level, req.userId]
  );
  res.json({ ok: true });
}));

// ---------- DSA PROBLEMS ----------

app.get("/api/problems", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM problems WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

app.post("/api/problems", auth, wrap(async (req, res) => {
  const { name, topic, difficulty, status } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Problem name is required." });
  await pool.query(
    "INSERT INTO problems (user_id, name, topic, difficulty, status) VALUES (?, ?, ?, ?, ?)",
    [req.userId, name.trim(), topic, difficulty, status || "Pending"]
  );
  res.json({ ok: true });
}));

app.put("/api/problems/:id", auth, wrap(async (req, res) => {
  const allowed = ["Pending", "In Progress", "Solved", "Revision Needed"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Choose a valid problem status." });
  await pool.query("UPDATE problems SET status = ? WHERE id = ? AND user_id = ?",
    [req.body.status, req.params.id, req.userId]);
  res.json({ ok: true });
}));

app.delete("/api/problems/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM problems WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// ---------- SUBJECTS ----------

app.get("/api/subjects", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM subjects WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

// body: { name: "DBMS", total: 10 } — user adds their own subject
app.post("/api/subjects", auth, wrap(async (req, res) => {
  const name = (req.body.name || "").trim();
  const total = Number(req.body.total);
  if (!name) return res.status(400).json({ error: "Subject name is required." });
  if (!Number.isInteger(total) || total < 1 || total > 200)
    return res.status(400).json({ error: "Total topics must be a whole number from 1 to 200." });
  await pool.query("INSERT INTO subjects (user_id, name, total) VALUES (?, ?, ?)", [req.userId, name, total]);
  res.json({ ok: true });
}));

app.delete("/api/subjects/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM subjects WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// body: { done: 5 }  (kept between 0 and total)
app.put("/api/subjects/:id", auth, wrap(async (req, res) => {
  await pool.query(
    "UPDATE subjects SET done = GREATEST(0, LEAST(total, ?)) WHERE id = ? AND user_id = ?",
    [Number(req.body.done) || 0, req.params.id, req.userId]
  );
  res.json({ ok: true });
}));

// ---------- APTITUDE ----------

app.get("/api/aptitude", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM aptitude WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

// body: { category, attempted, correct } — adds a practice session to the totals (creates the row on first use)
app.post("/api/aptitude/practice", auth, wrap(async (req, res) => {
  const attempted = Number(req.body.attempted);
  const correct = Number(req.body.correct);
  const category = req.body.category;
  if (!APTITUDE_CATEGORIES.includes(category)) return res.status(400).json({ error: "Unknown category." });
  if (!(attempted > 0) || correct < 0 || correct > attempted)
    return res.status(400).json({ error: "Enter valid numbers (correct cannot be more than attempted)." });

  // first practice creates the row, later practices add to it
  const [rows] = await pool.query("SELECT id FROM aptitude WHERE category = ? AND user_id = ?", [category, req.userId]);
  if (rows.length === 0)
    await pool.query("INSERT INTO aptitude (user_id, category, attempted, correct) VALUES (?, ?, ?, ?)",
      [req.userId, category, attempted, correct]);
  else
    await pool.query("UPDATE aptitude SET attempted = attempted + ?, correct = correct + ? WHERE id = ?",
      [attempted, correct, rows[0].id]);
  res.json({ ok: true });
}));

// ---------- STUDY PLANNER ----------

app.get("/api/planner", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM planner WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

app.post("/api/planner", auth, wrap(async (req, res) => {
  const { day, subject, duration } = req.body;
  if (!day || !subject || !subject.trim() || !duration) return res.status(400).json({ error: "Fill all fields." });
  await pool.query("INSERT INTO planner (user_id, day, subject, duration) VALUES (?, ?, ?, ?)",
    [req.userId, day, subject.trim(), duration]);
  res.json({ ok: true });
}));

app.delete("/api/planner/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM planner WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// ---------- GOALS ----------

app.get("/api/goals", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM goals WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

app.post("/api/goals", auth, wrap(async (req, res) => {
  const { title, period, progress } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Goal title is required." });
  await pool.query("INSERT INTO goals (user_id, title, period, progress) VALUES (?, ?, ?, ?)",
    [req.userId, title.trim(), period, (progress || "").trim() || "Pending"]);
  res.json({ ok: true });
}));

app.put("/api/goals/:id", auth, wrap(async (req, res) => {
  await pool.query("UPDATE goals SET done = ? WHERE id = ? AND user_id = ?",
    [req.body.done ? 1 : 0, req.params.id, req.userId]);
  res.json({ ok: true });
}));

app.delete("/api/goals/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM goals WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// ---------- DASHBOARD TASKS ----------

app.get("/api/tasks", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE user_id = ? ORDER BY id", [req.userId]);
  res.json(rows);
}));

app.post("/api/tasks", auth, wrap(async (req, res) => {
  if (!req.body.text || !req.body.text.trim()) return res.status(400).json({ error: "Task text is required." });
  await pool.query("INSERT INTO tasks (user_id, text) VALUES (?, ?)", [req.userId, req.body.text.trim()]);
  res.json({ ok: true });
}));

app.put("/api/tasks/:id", auth, wrap(async (req, res) => {
  await pool.query("UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?",
    [req.body.done ? 1 : 0, req.params.id, req.userId]);
  res.json({ ok: true });
}));

app.delete("/api/tasks/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// ---------- LEARNING RESOURCES ----------

app.get("/api/resources", auth, wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM resources WHERE user_id = ? ORDER BY id DESC", [req.userId]);
  res.json(rows);
}));

app.post("/api/resources", auth, wrap(async (req, res) => {
  const title = (req.body.title || "").trim();
  const category = req.body.category || "DSA";
  const resourceType = req.body.resourceType || "Website";
  const url = (req.body.url || "").trim();
  const description = (req.body.description || "").trim();
  if (!title || !url) return res.status(400).json({ error: "Resource title and URL are required." });
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "URL must start with http:// or https://." });
  if (!RESOURCE_CATEGORIES.includes(category)) return res.status(400).json({ error: "Choose a valid category." });
  if (!RESOURCE_TYPES.includes(resourceType)) return res.status(400).json({ error: "Choose a valid resource type." });
  await pool.query(
    "INSERT INTO resources (user_id, title, category, resource_type, url, description) VALUES (?, ?, ?, ?, ?, ?)",
    [req.userId, title, category, resourceType, url, description]
  );
  res.json({ ok: true });
}));

app.delete("/api/resources/:id", auth, wrap(async (req, res) => {
  await pool.query("DELETE FROM resources WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
}));

// ---------- STATS (Dashboard + Placement pages) ----------
// Every percentage is calculated from the user's real data.

const percent = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

app.get("/api/stats", auth, wrap(async (req, res) => {
  const id = req.userId;

  const [[p]] = await pool.query(
    "SELECT COUNT(*) AS total, COALESCE(SUM(status='Solved'),0) AS solved FROM problems WHERE user_id = ?", [id]);
  const [[s]] = await pool.query(
    "SELECT COALESCE(SUM(done),0) AS done, COALESCE(SUM(total),0) AS total FROM subjects WHERE user_id = ?", [id]);
  const [[a]] = await pool.query(
    "SELECT COALESCE(SUM(attempted),0) AS attempted, COALESCE(SUM(correct),0) AS correct FROM aptitude WHERE user_id = ?", [id]);
  const [[g]] = await pool.query(
    "SELECT COUNT(*) AS total, COALESCE(SUM(done),0) AS done FROM goals WHERE user_id = ?", [id]);
  const [[t]] = await pool.query(
    "SELECT COUNT(*) AS total, COALESCE(SUM(done),0) AS done FROM tasks WHERE user_id = ?", [id]);
  const [recent] = await pool.query(
    "SELECT name, topic, status, created_at FROM problems WHERE user_id = ? ORDER BY id DESC LIMIT 4", [id]);

  const dsa = percent(Number(p.solved), p.total);
  const subjects = percent(Number(s.done), Number(s.total));
  const aptitude = percent(Number(a.correct), Number(a.attempted));
  const goals = percent(Number(g.done), g.total);

  res.json({
    dsa, subjects, aptitude, goals,
    overall: Math.round((dsa + subjects + aptitude + goals) / 4),
    problemsSolved: Number(p.solved), problemsTotal: p.total,
    goalsDone: Number(g.done), goalsTotal: g.total,
    tasksDone: Number(t.done), tasksTotal: t.total,
    recent,
  });
}));

// Serve static frontend build if it exists (for production)
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(`<body style="font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:40px">
      <h2>✅ PlaceTrack server is running</h2>
      <p>This is only the backend (API). Build the frontend with <code>npm run build</code> or start the dev server at:
      <a style="color:#818cf8" href="http://localhost:5173">http://localhost:5173</a></p></body>`);
  });
}

// ---------- START ----------

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => app.listen(PORT, () => console.log(`✅ PlaceTrack server running on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("❌ Could not connect to MySQL:", err.message);
    console.error("   Check that MySQL is running and your server/.env details are correct.");
    process.exit(1);
  });
