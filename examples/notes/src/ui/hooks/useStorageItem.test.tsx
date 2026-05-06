// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { settingsStorage } from "@/core/storage/storageItems";
import { createSettings } from "../../../tests/helpers/factories";
import { useStorageItem } from "./useStorageItem";

describe("useStorageItem", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("starts with fallback state and resolves to stored value", async () => {
    await settingsStorage.setValue(createSettings({ theme: "dark" }));

    const { result } = renderHook(() => useStorageItem(settingsStorage));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.value.theme).toBe("dark");
    });
  });

  it("re-renders when the underlying storage value changes", async () => {
    const { result } = renderHook(() => useStorageItem(settingsStorage));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await settingsStorage.setValue(createSettings({ theme: "light" }));
    });

    await waitFor(() => {
      expect(result.current.value.theme).toBe("light");
    });
  });

  it("writes through to storage when update is called", async () => {
    const { result } = renderHook(() => useStorageItem(settingsStorage));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const next = createSettings({ theme: "dark" });
    await act(async () => {
      await result.current.update(next);
    });

    expect(await settingsStorage.getValue()).toEqual(next);
  });

  it("does not throw after unmount when storage updates land late", async () => {
    const { result, unmount } = renderHook(() =>
      useStorageItem(settingsStorage)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    unmount();

    await act(async () => {
      await settingsStorage.setValue(createSettings({ theme: "light" }));
    });

    expect(true).toBe(true);
  });
});
