import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";

const rootEl = document.getElementById("app");
if (!rootEl) {
  throw new Error('Elemento raiz "#app" não encontrado.');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
