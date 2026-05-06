// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import * as messaging from "@/core/messaging";
import { settingsStorage } from "@/core/storage/storageItems";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import { DemoNotesPanel } from "./DemoNotesPanel";

describe("DemoNotesPanel", () => {
  beforeEach(async () => {
    fakeBrowser.reset();
    vi.restoreAllMocks();
    await settingsStorage.setValue({
      theme: "system",
      maxNotes: 100,
    });
  });

  it("renders saved notes", async () => {
    await demoNotesStorage.setValue([
      {
        id: "1",
        text: "First note",
        source: "popup",
        createdAt: 1,
      },
    ]);

    render(<DemoNotesPanel />);

    await waitFor(() => {
      expect(screen.getByText("First note")).toBeTruthy();
    });
  });

  it("creates a note from the popup form", async () => {
    vi.spyOn(messaging, "sendMessage").mockImplementation((async (
      type: messaging.AppMessageType,
      payload: unknown
    ) => {
      if (type === "demoNotes/createNote") {
        const notes = await demoNotesStorage.getValue();
        await demoNotesStorage.setValue([
          {
            id: "new-note",
            text: (payload as { text: string }).text,
            source: "popup",
            createdAt: 1,
          },
          ...notes,
        ]);

        return {
          ok: true,
          data: {
            id: "new-note",
            text: (payload as { text: string }).text,
            source: "popup" as const,
            createdAt: 1,
          },
        };
      }

      return;
    }) as never);

    render(<DemoNotesPanel />);

    await userEvent.type(
      screen.getByPlaceholderText("Write a note"),
      "New note"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save Note" }));

    await waitFor(async () => {
      const notes = await demoNotesStorage.getValue();
      expect(notes[0]?.text).toBe("New note");
    });
  });
});
