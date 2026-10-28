// main.jsx — This is the very first file React runs.
// It connects our App to the HTML file (index.html).
// You don't need to change anything here.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
