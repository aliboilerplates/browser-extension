import { sendRuntimeMessage } from "@/core/messaging";

export async function saveSelectionAsNote(text: string) {
  if (!text.trim()) {
    return;
  }

  await sendRuntimeMessage("demoNotes/saveSelectedText", { text });
}

