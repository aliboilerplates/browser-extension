import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { sendMessage } from "./sendMessage";

describe("sendMessage", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("returns successful response payloads", async () => {
    fakeBrowser.runtime.sendMessage = vi.fn().mockResolvedValue({
      ok: true,
      data: {
        theme: "system",
        maxNotes: 100,
      },
    }) as typeof fakeBrowser.runtime.sendMessage;

    await expect(sendMessage("core/getSettings")).resolves.toEqual({
      ok: true,
      data: {
        theme: "system",
        maxNotes: 100,
      },
    });
  });
});
