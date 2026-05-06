/* eslint-disable unicorn/no-useless-undefined */
import { describe, expect, it } from "vitest";
import {
  getMessageTarget,
  isKnownMessageType,
  requiresResponse,
} from "./messageMetadata";
import { MESSAGE_TARGET } from "./messageConstants";

describe("getMessageTarget", () => {
  it("resolves background messages", () => {
    expect(getMessageTarget("core/getSettings")).toBe(MESSAGE_TARGET.background);
    expect(getMessageTarget("core/ping")).toBe(MESSAGE_TARGET.background);
  });

  it("resolves content messages", () => {
    expect(getMessageTarget("content/showToast")).toBe(MESSAGE_TARGET.content);
  });

  it("resolves offscreen messages", () => {
    expect(getMessageTarget("offscreen/ping")).toBe(MESSAGE_TARGET.offscreen);
  });
});

describe("requiresResponse", () => {
  it("returns true for response messages", () => {
    expect(requiresResponse("core/getSettings")).toBe(true);
    expect(requiresResponse("core/ping")).toBe(true);
  });

  it("returns false for fire-and-forget messages", () => {
    expect(requiresResponse("content/showToast")).toBe(false);
  });
});

describe("isKnownMessageType", () => {
  it("accepts every registered message type", () => {
    expect(isKnownMessageType("core/getSettings")).toBe(true);
    expect(isKnownMessageType("content/showToast")).toBe(true);
    expect(isKnownMessageType("offscreen/ping")).toBe(true);
  });

  it("rejects unknown strings", () => {
    expect(isKnownMessageType("not/a/message")).toBe(false);
    expect(isKnownMessageType("")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isKnownMessageType(undefined)).toBe(false);
    expect(isKnownMessageType(null)).toBe(false);
    expect(isKnownMessageType(42)).toBe(false);
    expect(isKnownMessageType({})).toBe(false);
    expect(isKnownMessageType([])).toBe(false);
  });
});
