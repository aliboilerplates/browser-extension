# `src/core/messaging/messageConstants.ts`

Add the four demo-notes entries to `BACKGROUND_MESSAGE`:

```ts
export const BACKGROUND_MESSAGE = {
  getSettings: "core/getSettings",
  updateSettings: "core/updateSettings",
  ping: "core/ping",
  // Demo overlay:
  getNotes: "demoNotes/getNotes",
  createNote: "demoNotes/createNote",
  deleteNote: "demoNotes/deleteNote",
  saveSelectedText: "demoNotes/saveSelectedText",
} as const;
```
