import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "@/popup/App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
