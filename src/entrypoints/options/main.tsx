import "@/assets.css";
import { settingsStorage } from "@/core/storage/storageItems";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import { useStorageItem } from "@/ui/hooks/useStorageItem";
import React from "react";
import ReactDOM from "react-dom/client";

function OptionsApp() {
  const { value: settings, update } = useStorageItem(settingsStorage);

  return (
    <ThemeProvider>
      <main className="bg-base-100 text-base-content min-h-screen p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-semibold">Template Options</h1>
          <p className="text-sm opacity-75">
            Direct preference writes are allowed from options.
          </p>
          <label className="form-control w-full max-w-xs">
            <span className="label-text mb-2">Theme</span>
            <select
              className="select select-bordered"
              onChange={(event) => {
                void update({
                  ...settings,
                  theme: event.target.value as typeof settings.theme,
                });
              }}
              value={settings.theme}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </main>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Options root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
);
