import type { Settings } from "@/shared/types";
import { storage } from "wxt/utils/storage";

export const settingsStorage = storage.defineItem<Settings>("local:settings", {
  fallback: {
    theme: "system",
  },
  version: 1,
});

export const onboardingShownStorage = storage.defineItem<boolean>(
  "session:onboardingShown",
  {
    fallback: false,
  }
);
