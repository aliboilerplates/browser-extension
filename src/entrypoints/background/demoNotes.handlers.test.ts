import { beforeEach, describe, expect, it, vi } from "vitest";
import * as messaging from "@/core/messaging";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import {
  handleCreateNote,
  handleDeleteNote,
  handleGetNotes,
  handleSaveSelectedText,
} from "./demoNotes.handlers";

describe("demo notes background handlers", () => {
  beforeEach(async () => {
    fakeBrowser.reset();
    vi.restoreAllMocks();
    await demoNotesStorage.setValue([]);
  });

  it("creates a note", async () => {
    const response = await handleCreateNote({
      type: "demoNotes/createNote",
      target: messaging.MESSAGE_TARGET.background,
      payload: {
        text: "Hello",
        source: "popup",
      },
    });

    expect(response.ok).toBe(true);

    const notes = await demoNotesStorage.getValue();
    expect(notes).toHaveLength(1);
    expect(notes[0]?.text).toBe("Hello");
  });

  it("deletes a note", async () => {
    await demoNotesStorage.setValue([
      {
        id: "1",
        text: "Delete me",
        source: "popup",
        createdAt: 1,
      },
    ]);

    await handleDeleteNote({
      type: "demoNotes/deleteNote",
      target: messaging.MESSAGE_TARGET.background,
      payload: {
        id: "1",
      },
    });

    expect(await demoNotesStorage.getValue()).toEqual([]);
  });

  it("returns stored notes", async () => {
    await demoNotesStorage.setValue([
      {
        id: "1",
        text: "Saved",
        source: "popup",
        createdAt: 1,
      },
    ]);

    const response = await handleGetNotes();

    expect(response).toEqual({
      ok: true,
      data: [
        {
          id: "1",
          text: "Saved",
          source: "popup",
          createdAt: 1,
        },
      ],
    });
  });

  it("saves selected text and sends a toast", async () => {
    const toastSpy = vi
      .spyOn(messaging, "sendMessageToActiveTab")
      .mockResolvedValue(undefined);

    await handleSaveSelectedText({
      type: "demoNotes/saveSelectedText",
      target: messaging.MESSAGE_TARGET.background,
      payload: {
        text: "Selected text",
      },
    });

    const notes = await demoNotesStorage.getValue();
    expect(notes[0]?.text).toBe("Selected text");
    expect(toastSpy).toHaveBeenCalledWith("content/showToast", {
      message: "Saved selection as note",
    });
  });
});
