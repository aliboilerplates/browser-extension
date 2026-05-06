import { sendMessage } from "@/core/messaging";
import { settingsStorage } from "@/core/storage/storageItems";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import { useStorageItem } from "@/ui/hooks/useStorageItem";
import { useState } from "react";

type PingState =
  | { status: "idle" }
  | { status: "ok"; pongAt: number }
  | { status: "error"; reason: string };

export function PopupApp() {
  const { value: settings, update } = useStorageItem(settingsStorage);
  const [pingState, setPingState] = useState<PingState>({ status: "idle" });

  async function handlePing() {
    const response = await sendMessage("core/ping");

    if (!response.ok) {
      setPingState({ status: "error", reason: response.error.message });
      return;
    }

    const result = response.data;

    if (!result.ok) {
      setPingState({ status: "error", reason: result.error.code });
      return;
    }

    setPingState({ status: "ok", pongAt: result.pongAt });
  }

  return (
    <ThemeProvider>
      <main className="bg-base-100 text-base-content min-h-screen p-4">
        <div className="mx-auto max-w-md space-y-4">
          <h1 className="text-xl font-semibold">Template Popup</h1>

          <label className="form-control w-full">
            <span className="label-text mb-2">Theme</span>
            <select
              aria-label="Theme"
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

          <div className="space-y-2">
            <button
              className="btn btn-primary w-full"
              onClick={() => void handlePing()}
              type="button"
            >
              Ping background
            </button>
            {pingState.status === "ok" ? (
              <p className="text-sm opacity-70">
                Pong at {new Date(pingState.pongAt).toLocaleTimeString()}
              </p>
            ) : null}
            {pingState.status === "error" ? (
              <p className="text-error text-sm">Error: {pingState.reason}</p>
            ) : null}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
