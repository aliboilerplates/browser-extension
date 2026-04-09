import "@/assets.css";
import { DemoNotesPanel } from "./DemoNotesPanel";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom/client";

function PopupApp() {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-base-100 p-4 text-base-content">
        <div className="mx-auto max-w-md">
          <DemoNotesPanel />
        </div>
      </main>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Popup root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
);
