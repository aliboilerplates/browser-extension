import { sendMessage } from "@/core/messaging";

export async function saveSelectionAsNote(text: string) {
  if (!text.trim()) {
    return;
  }

  await sendMessage("demoNotes/saveSelectedText", { text });
}
