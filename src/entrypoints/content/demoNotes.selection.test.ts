import { describe, expect, it } from "vitest";
import { getSelectedText } from "./demoNotes.selection";

describe("getSelectedText", () => {
  it("returns trimmed selection text", () => {
    const selection = {
      toString: () => "  hello world  ",
    };

    Object.defineProperty(window, "getSelection", {
      configurable: true,
      value: () => selection,
    });

    expect(getSelectedText()).toBe("hello world");
  });
});

