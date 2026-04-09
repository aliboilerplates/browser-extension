import { describe, expect, it, vi } from "vitest";
import {
  supportsContextMenus,
  supportsOffscreen,
  supportsSidePanel,
} from "./capabilities";

describe("browser capabilities", () => {
  it("checks context menus via browser availability", () => {
    expect(typeof supportsContextMenus()).toBe("boolean");
  });

  it("returns false for unavailable chrome-only capabilities in test env", () => {
    vi.stubGlobal("chrome", {});

    expect(supportsOffscreen()).toBe(false);
    expect(supportsSidePanel()).toBe(false);
  });
});
