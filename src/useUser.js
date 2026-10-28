// useUser.js — A simple helper to get the logged-in user's info
// Used in every page header to show the correct name and initial

function useUser() {
  const savedUser = JSON.parse(localStorage.getItem("placetrack_user")) || {};
  const name    = savedUser.name  || "Student";
  const email   = savedUser.email || "";
  const initial = name.charAt(0).toUpperCase();
  return { name, email, initial };
}

export default useUser;
