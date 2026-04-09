import { describe, expect, it } from "vitest";
import { backgroundMessageListener } from "@/core/messaging/backgroundHandlers";

describe("background messaging", () => {
  it("registers a background listener", () => {
    expect(backgroundMessageListener).toBeTypeOf("function");
  });
});
