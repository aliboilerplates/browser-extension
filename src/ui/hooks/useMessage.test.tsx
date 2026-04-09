// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import * as messaging from "@/core/messaging";
import { useMessage } from "./useMessage";

describe("useMessage", () => {
  it("tracks loading and delegates to sendRuntimeMessage", async () => {
    const spy = vi
      .spyOn(messaging, "sendRuntimeMessage")
      .mockResolvedValue({
        theme: "system",
        maxNotes: 100,
      });

    const { result } = renderHook(() => useMessage("core/getSettings"));

    await act(async () => {
      const response = await result.current.send(undefined);
      expect(response.maxNotes).toBe(100);
    });

    expect(spy).toHaveBeenCalledWith("core/getSettings", undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
