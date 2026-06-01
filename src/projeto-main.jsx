import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProjetoSolarApp from "./ProjetoSolarApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProjetoSolarApp />
  </StrictMode>,
);
