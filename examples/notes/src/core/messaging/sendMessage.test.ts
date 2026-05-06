/* eslint-disable unicorn/no-useless-undefined */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { sendMessage } from "./sendMessage";

describe("sendMessage — background routing", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("returns successful response payloads for response messages", async () => {
    fakeBrowser.runtime.sendMessage = vi.fn().mockResolvedValue({
      ok: true,
      data: { theme: "system" },
    }) as typeof fakeBrowser.runtime.sendMessage;

    await expect(sendMessage("core/getSettings")).resolves.toEqual({
      ok: true,
      data: { theme: "system" },
    });
  });

  it("forwards the typed request shape to runtime.sendMessage", async () => {
    const sendSpy = vi.fn().mockResolvedValue({ ok: true, data: { theme: "dark" } });
    fakeBrowser.runtime.sendMessage = sendSpy as typeof fakeBrowser.runtime.sendMessage;

    await sendMessage("core/updateSettings", { theme: "dark" });

    expect(sendSpy).toHaveBeenCalledWith({
      type: "core/updateSettings",
      target: "BACKGROUND",
      payload: { theme: "dark" },
    });
  });
});

describe("sendMessage — content routing", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("delivers to a specific tab when tabId is provided", async () => {
    const tabSpy = vi.fn().mockResolvedValue(undefined);
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await sendMessage("content/showToast", { message: "Hi" }, { tabId: 42 });

    expect(tabSpy).toHaveBeenCalledWith(
      42,
      {
        type: "content/showToast",
        target: "CONTENT",
        payload: { message: "Hi" },
      },
      undefined
    );
  });

  it("forwards frameId when provided", async () => {
    const tabSpy = vi.fn().mockResolvedValue(undefined);
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await sendMessage(
      "content/showToast",
      { message: "Hi" },
      { tabId: 7, frameId: 3 }
    );

    expect(tabSpy).toHaveBeenLastCalledWith(7, expect.anything(), { frameId: 3 });
  });

  it("falls back to the active tab when tabId is omitted", async () => {
    fakeBrowser.tabs.query = vi
      .fn()
      .mockResolvedValue([{ id: 99 }]) as typeof fakeBrowser.tabs.query;
    const tabSpy = vi.fn().mockResolvedValue(undefined);
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await sendMessage("content/showToast", { message: "Hi" });

    expect(tabSpy).toHaveBeenCalledWith(99, expect.anything(), undefined);
  });

  it("returns silently for fire-and-forget when no active tab is available", async () => {
    fakeBrowser.tabs.query = vi
      .fn()
      .mockResolvedValue([]) as typeof fakeBrowser.tabs.query;
    const tabSpy = vi.fn();
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await expect(
      sendMessage("content/showToast", { message: "Hi" })
    ).resolves.toBeUndefined();
    expect(tabSpy).not.toHaveBeenCalled();
  });

  it("retries on transient connection errors and succeeds", async () => {
    const tabSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error("Could not establish connection"))
      .mockResolvedValueOnce(undefined);
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await sendMessage("content/showToast", { message: "Hi" }, { tabId: 1 });

    expect(tabSpy).toHaveBeenCalledTimes(2);
  });

  it("does not retry on non-connection errors", async () => {
    const tabSpy = vi.fn().mockRejectedValue(new Error("Some other error"));
    fakeBrowser.tabs.sendMessage = tabSpy as typeof fakeBrowser.tabs.sendMessage;

    await sendMessage("content/showToast", { message: "Hi" }, { tabId: 1 });

    expect(tabSpy).toHaveBeenCalledTimes(1);
  });
});
