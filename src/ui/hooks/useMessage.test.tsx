// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import * as messaging from "@/core/messaging";
import { useMessage } from "./useMessage";

describe("useMessage", () => {
  it("tracks loading and delegates to sendMessage", async () => {
    const spy = vi.spyOn(messaging, "sendMessage").mockImplementation(
      () =>
        ({
          ok: true,
          data: {
            theme: "system",
            maxNotes: 100,
          },
        }) as never
    );

    const { result } = renderHook(() => useMessage("core/getSettings"));

    await act(async () => {
      const response = await result.current.send();
      expect(response).toEqual({
        ok: true,
        data: {
          theme: "system",
          maxNotes: 100,
        },
      });
    });

    expect(spy).toHaveBeenCalledWith("core/getSettings");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
