import type { ThemePreference } from "./index";

export type NoteSource = "popup" | "content" | "context-menu";

export interface Note {
  id: string;
  text: string;
  source: NoteSource;
  createdAt: number;
}

export interface Settings {
  theme: ThemePreference;
  maxNotes: number;
}

