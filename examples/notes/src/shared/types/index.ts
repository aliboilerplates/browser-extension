export type ThemePreference = "light" | "dark" | "system";

export interface Settings {
  theme: ThemePreference;
  maxNotes: number;
}

export type { Note, NoteSource } from "./note";
export type { DemoNote } from "./demoNotes";
