# `src/core/messaging/definitions/backgroundMessages.ts`

Import `DemoNote` and add the four entries to both the map and the config:

```ts
import type { Settings } from "@/shared/types";
import type { DemoNote } from "@/shared/types/demoNotes";
import type { MessageConfigMap, Result } from "../contracts";
import { BACKGROUND_MESSAGE, MESSAGE_TARGET } from "../messageConstants";

export interface BackgroundMessageMap {
  [BACKGROUND_MESSAGE.getSettings]: { request: void; response: Settings };
  [BACKGROUND_MESSAGE.updateSettings]: {
    request: Partial<Settings>;
    response: Settings;
  };
  [BACKGROUND_MESSAGE.ping]: {
    request: void;
    response: Result<"unavailable", { pongAt: number }>;
  };
  // Demo overlay:
  [BACKGROUND_MESSAGE.getNotes]: { request: void; response: DemoNote[] };
  [BACKGROUND_MESSAGE.createNote]: {
    request: { text: string; source: DemoNote["source"] };
    response: DemoNote;
  };
  [BACKGROUND_MESSAGE.deleteNote]: { request: { id: string }; response: void };
  [BACKGROUND_MESSAGE.saveSelectedText]: {
    request: { text: string };
    response: void;
  };
}

export const backgroundMessageConfig = {
  [BACKGROUND_MESSAGE.getSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.updateSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.ping]: { requiresResponse: true },
  // Demo overlay:
  [BACKGROUND_MESSAGE.getNotes]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.createNote]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.deleteNote]: { requiresResponse: false },
  [BACKGROUND_MESSAGE.saveSelectedText]: { requiresResponse: false },
} as const satisfies MessageConfigMap<BackgroundMessageMap>;
```

# `src/entrypoints/background/messageListener.ts`

Wire the four handlers alongside the core handlers:

```ts
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
      return { ok: true, data: next };
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
```
