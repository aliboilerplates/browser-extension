/* eslint-disable unicorn/no-useless-undefined, @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it, vi } from "vitest";
import { MESSAGE_TARGET } from "./messageConstants";
import { createRuntimeMessageListener } from "./createMessageListener";
import { isRuntimeRequestForTarget } from "./messageUtils";

describe("isRuntimeRequestForTarget", () => {
  it("accepts known messages for the expected target", () => {
    expect(
      isRuntimeRequestForTarget(MESSAGE_TARGET.background, {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      })
    ).toBe(true);
  });

  it("rejects messages for a different target", () => {
    expect(
      isRuntimeRequestForTarget(MESSAGE_TARGET.content, {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      })
    ).toBe(false);
  });

  it("rejects non-object messages", () => {
    expect(isRuntimeRequestForTarget(MESSAGE_TARGET.background, null)).toBe(false);
    expect(isRuntimeRequestForTarget(MESSAGE_TARGET.background, "string")).toBe(
      false
    );
    expect(isRuntimeRequestForTarget(MESSAGE_TARGET.background, 42)).toBe(false);
    expect(isRuntimeRequestForTarget(MESSAGE_TARGET.background, [])).toBe(false);
  });

  it("rejects messages with unknown type strings", () => {
    expect(
      isRuntimeRequestForTarget(MESSAGE_TARGET.background, {
        type: "unknown/message",
        target: MESSAGE_TARGET.background,
      })
    ).toBe(false);
  });
});

describe("createRuntimeMessageListener", () => {
  it("routes to the matching handler and sends a response", async () => {
    const handler = vi.fn().mockResolvedValue({
      ok: true,
      data: {
        theme: "system",
        maxNotes: 100,
      },
    });
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.background, {
      "core/getSettings": handler,
    });
    const sendResponse = vi.fn();

    const shouldKeepAlive = listener(
      {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      },
      {},
      sendResponse
    );

    expect(shouldKeepAlive).toBe(true);
    await Promise.resolve();
    await Promise.resolve();
    expect(handler).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith({
      ok: true,
      data: {
        theme: "system",
        maxNotes: 100,
      },
    });
  });

  it("returns a runtime failure when no handler is registered for the type", () => {
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.background, {});
    const sendResponse = vi.fn();

    listener(
      {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      },
      {},
      sendResponse
    );

    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: { message: expect.stringContaining("No handler registered") },
    });
  });

  it("ignores messages whose target does not match the listener", () => {
    const handler = vi.fn();
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.background, {
      "core/getSettings": handler,
    });
    const sendResponse = vi.fn();

    const result = listener(
      {
        type: "content/showToast",
        target: MESSAGE_TARGET.content,
        payload: { message: "ignored" },
      },
      {},
      sendResponse
    );

    expect(result).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
  });

  it("converts handler exceptions into runtime failures", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("kaboom"));
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.background, {
      "core/getSettings": handler,
    });
    const sendResponse = vi.fn();

    listener(
      {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      },
      {},
      sendResponse
    );

    await Promise.resolve();
    await Promise.resolve();

    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: { message: "kaboom" },
    });
  });

  it("reports a missing-response failure when a response handler returns void", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.background, {
      "core/getSettings": handler,
    });
    const sendResponse = vi.fn();

    listener(
      {
        type: "core/getSettings",
        target: MESSAGE_TARGET.background,
        payload: undefined,
      },
      {},
      sendResponse
    );

    await Promise.resolve();
    await Promise.resolve();

    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: { message: expect.stringContaining("Missing response") },
    });
  });

  it("does not call sendResponse for fire-and-forget messages", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const listener = createRuntimeMessageListener(MESSAGE_TARGET.content, {
      "content/showToast": handler,
    });
    const sendResponse = vi.fn();

    const result = listener(
      {
        type: "content/showToast",
        target: MESSAGE_TARGET.content,
        payload: { message: "Hi" },
      },
      {},
      sendResponse
    );

    expect(result).toBeUndefined();
    await Promise.resolve();
    await Promise.resolve();
    expect(handler).toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
