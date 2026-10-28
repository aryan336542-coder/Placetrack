// App.jsx — Main file. Handles all routes + login protection.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DSA       from "./pages/DSA";
import Subjects  from "./pages/Subjects";
import Aptitude  from "./pages/Aptitude";
import Planner   from "./pages/Planner";
import Goals     from "./pages/Goals";
import Placement from "./pages/Placement";
import Profile   from "./pages/Profile";
import Resources from "./pages/Resources";

// ProtectedRoute — checks if user is logged in
// If NOT logged in → send to /login
// If logged in → show the page normally
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("placetrack_token");
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — anyone can access */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages — only logged-in users */}
        <Route path="/"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dsa"       element={<ProtectedRoute><DSA /></ProtectedRoute>} />
        <Route path="/subjects"  element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/aptitude"  element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/planner"   element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/goals"     element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
