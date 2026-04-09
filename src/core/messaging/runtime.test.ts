import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { sendRuntimeMessage } from "./runtime";
import { MessagingTimeoutError } from "./errors";

describe("sendRuntimeMessage", () => {
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

    await expect(sendRuntimeMessage("core/getSettings", undefined)).resolves.toEqual({
      theme: "system",
      maxNotes: 100,
    });
  });

  it("times out long-running requests", async () => {
    fakeBrowser.runtime.sendMessage = vi.fn(
      () => new Promise(() => undefined)
    ) as typeof fakeBrowser.runtime.sendMessage;

    await expect(
      sendRuntimeMessage("core/getSettings", undefined, { timeoutMs: 5 })
    ).rejects.toBeInstanceOf(MessagingTimeoutError);
  });
});
