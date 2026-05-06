import "@/assets.css";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { DemoNotesPanel } from "./DemoNotesPanel";

function PopupApp() {
  return (
    <ThemeProvider>
      <main className="bg-base-100 text-base-content min-h-screen p-4">
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
