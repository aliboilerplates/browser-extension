import { settingsStorage } from "@/core/storage/storageItems";
import { createRuntimeMessageListener, MESSAGE_TARGET } from "@/core/messaging";
import {
  handleCreateNote,
  handleDeleteNote,
  handleGetNotes,
  handleSaveSelectedText,
} from "./demoNotes.handlers";

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
    "core/ping": () => ({
      ok: true,
      data: { ok: true, pongAt: Date.now() },
    }),
    "demoNotes/getNotes": handleGetNotes,
    "demoNotes/createNote": handleCreateNote,
    "demoNotes/deleteNote": handleDeleteNote,
    "demoNotes/saveSelectedText": handleSaveSelectedText,
  }
);
