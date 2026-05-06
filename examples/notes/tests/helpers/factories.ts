import type { Note, Settings } from "@/shared/types";

export function createNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "note-1",
    text: "Test note",
    source: "popup",
    createdAt: 1,
    ...overrides,
  };
}

export function createSettings(
  overrides: Partial<Settings> = {}
): Settings {
  return {
    theme: "system",
    maxNotes: 100,
    ...overrides,
  };
}
