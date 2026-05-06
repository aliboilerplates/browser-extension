export type NoteSource = "popup" | "content" | "context-menu";

export interface Note {
  id: string;
  text: string;
  source: NoteSource;
  createdAt: number;
}
