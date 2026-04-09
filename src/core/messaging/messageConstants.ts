export const MESSAGE_TARGET = {
  background: "BACKGROUND",
  content: "CONTENT",
  offscreen: "OFFSCREEN",
} as const;

export const BACKGROUND_MESSAGE = {
  getSettings: "core/getSettings",
  updateSettings: "core/updateSettings",
  getNotes: "demoNotes/getNotes",
  createNote: "demoNotes/createNote",
  deleteNote: "demoNotes/deleteNote",
  saveSelectedText: "demoNotes/saveSelectedText",
} as const;

export const CONTENT_MESSAGE = {
  showToast: "content/showToast",
} as const;

export const OFFSCREEN_MESSAGE = {
  ping: "offscreen/ping",
} as const;
