import { describe, expect, it, vi } from "vitest";
import { MESSAGE_TARGET } from "./contracts";
import { createRuntimeMessageListener, isRuntimeRequestForTarget } from "./listener";

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
      {} as never,
      sendResponse
    );

    expect(shouldKeepAlive).toBe(true);
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
});

