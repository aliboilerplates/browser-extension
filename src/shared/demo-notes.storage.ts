import { storage } from "wxt/utils/storage";
import type { DemoNote } from "@/shared/types/demoNotes";

export const demoNotesStorage = storage.defineItem<DemoNote[]>("local:demo-notes", {
  fallback: [],
  version: 1,
});
