// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { settingsStorage } from "@/core/storage/storageItems";
import { useStorageItem } from "./useStorageItem";

describe("useStorageItem", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("starts with fallback state and resolves to stored value", async () => {
    await settingsStorage.setValue({
      theme: "dark",
      maxNotes: 50,
    });

    const { result } = renderHook(() => useStorageItem(settingsStorage));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.value.theme).toBe("dark");
    });
  });
});
