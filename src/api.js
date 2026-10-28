// api.js — one small helper used by every page to talk to the Node backend.
// Usage:  const data = await api("/problems");
//         await api("/problems", "POST", { name: "Two Sum" });

const BASE = "/api"; // vite.config.js forwards /api to http://localhost:5000

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("placetrack_token");

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }

  const data = await res.json().catch(() => ({}));

  // Token expired / invalid → log out and go to login page
  if (res.status === 401 && token) {
    clearSession();
    window.location.href = "/login";
  }
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export function saveSession(token, user) {
  localStorage.setItem("placetrack_token", token);
  localStorage.setItem("placetrack_user", JSON.stringify(user)); // name + email for the header
}

export function clearSession() {
  localStorage.removeItem("placetrack_token");
  localStorage.removeItem("placetrack_user");
}
