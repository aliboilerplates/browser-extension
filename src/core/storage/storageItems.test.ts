import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { onboardingShownStorage, settingsStorage } from "./storageItems";

describe("shared storage", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("returns default settings fallback", async () => {
    expect(await settingsStorage.getValue()).toEqual({
      theme: "system",
    });
  });

  it("supports session flags", async () => {
    expect(await onboardingShownStorage.getValue()).toBe(false);
    await onboardingShownStorage.setValue(true);
    expect(await onboardingShownStorage.getValue()).toBe(true);
  });
});
