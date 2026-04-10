/* eslint-disable unicorn/no-useless-undefined */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { sendMessageToActiveTab, sendMessageToTab } from "./contentTransport";

describe("sendMessageToTab", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("retries transient content connection failures", async () => {
    const sendMessage = vi
      .fn()
      .mockRejectedValueOnce(new Error("Could not establish connection"))
      .mockResolvedValueOnce(undefined);

    fakeBrowser.tabs.sendMessage =
      sendMessage as typeof fakeBrowser.tabs.sendMessage;

    await sendMessageToTab(
      1,
      "content/showToast",
      { message: "Hello" },
      {
        maxRetries: 1,
        retryDelayMs: 0,
      }
    );

    expect(sendMessage).toHaveBeenCalledTimes(2);
  });
  it("fails clearly when there is no active tab", async () => {
    fakeBrowser.tabs.query = vi
      .fn()
      .mockResolvedValue([]) as typeof fakeBrowser.tabs.query;

    await expect(
      sendMessageToActiveTab("content/showToast", { message: "Hello" })
    ).rejects.toThrow("No active tab available");
  });
});
