import { settingsStorage } from "@/core/storage/storageItems";
import { createRuntimeMessageListener, MESSAGE_TARGET } from "@/core/messaging";

export const backgroundMessageListener = createRuntimeMessageListener(
  MESSAGE_TARGET.background,
  {
    "core/getSettings": async () => ({
      ok: true,
      data: await settingsStorage.getValue(),
    }),
    "core/updateSettings": async (message) => {
      const current = await settingsStorage.getValue();
      const next = { ...current, ...message.payload };
      await settingsStorage.setValue(next);

      return {
        ok: true,
        data: next,
      };
    },
    // The outer `ok` is RuntimeSuccess (transport). The inner `ok` is the Result
    // payload (domain). Returning `{ ok: false, error: { code: "unavailable" } }`
    // here would still be a transport success — the consumer branches on it.
    "core/ping": () => ({
      ok: true,
      data: { ok: true, pongAt: Date.now() },
    }),
  }
);
