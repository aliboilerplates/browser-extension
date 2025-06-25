import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./views/App";

const container = document.createElement("div");
container.id = "content-container";
document.body.appendChild(container);
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
