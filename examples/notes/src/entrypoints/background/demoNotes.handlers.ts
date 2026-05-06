import { sendMessage } from "@/core/messaging";
import type { RuntimeRequest } from "@/core/messaging";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import type { DemoNote } from "@/shared/types/demoNotes";

function createNote(text: string, source: DemoNote["source"]): DemoNote {
  return {
    id: crypto.randomUUID(),
    text,
    source,
    createdAt: Date.now(),
  };
}

export async function handleGetNotes() {
  return {
    ok: true,
    data: await demoNotesStorage.getValue(),
  } as const;
}

export async function handleCreateNote(
  message: RuntimeRequest<"demoNotes/createNote">
) {
  const notes = await demoNotesStorage.getValue();
  const note = createNote(message.payload.text.trim(), message.payload.source);
  await demoNotesStorage.setValue([note, ...notes]);

  return {
    ok: true,
    data: note,
  } as const;
}

export async function handleDeleteNote(
  message: RuntimeRequest<"demoNotes/deleteNote">
) {
  const notes = await demoNotesStorage.getValue();
  await demoNotesStorage.setValue(
    notes.filter((note: DemoNote) => note.id !== message.payload.id)
  );
}

export async function handleSaveSelectedText(
  message: RuntimeRequest<"demoNotes/saveSelectedText">
) {
  const text = message.payload.text.trim();

  if (!text) {
    return;
  }

  const notes = await demoNotesStorage.getValue();
  const note = createNote(text, "content");
  await demoNotesStorage.setValue([note, ...notes]);

  // Fire-and-forget: sendMessage returns void for command-style content
  // messages and does not throw on delivery failure.
  await sendMessage("content/showToast", { message: "Saved selection as note" });
}
