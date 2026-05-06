// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { sendMessage } from "@/core/messaging/sendMessage";
import type { RuntimeResponse } from "@/core/messaging";
import { useMessage } from "./useMessage";

vi.mock("@/core/messaging/sendMessage", () => ({
  sendMessage: vi.fn(),
}));

describe("useMessage", () => {
  it("tracks loading and delegates to sendMessage", async () => {
    type GetSettingsMessage = (
      type: "core/getSettings"
    ) => Promise<RuntimeResponse<"core/getSettings">>;

    const sendMessageMock = vi.mocked(sendMessage as GetSettingsMessage);
    const response: RuntimeResponse<"core/getSettings"> = {
      ok: true,
      data: {
        theme: "system",
      },
    };
    sendMessageMock.mockImplementation(() => Promise.resolve(response));

    const { result } = renderHook(() => useMessage("core/getSettings"));

    await act(async () => {
      const response = await result.current.send();
      expect(response).toEqual({
        ok: true,
        data: {
          theme: "system",
        },
      });
    });

    expect(sendMessageMock).toHaveBeenCalledWith("core/getSettings");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
