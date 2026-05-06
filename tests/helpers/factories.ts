import type { Settings } from "@/shared/types";

export function createSettings(
  overrides: Partial<Settings> = {}
): Settings {
  return {
    theme: "system",
    ...overrides,
  };
}
