import type { Settings } from "@/shared/types";
import type { MessageConfigMap, Result } from "../contracts";
import { BACKGROUND_MESSAGE, MESSAGE_TARGET } from "../messageConstants";

export interface BackgroundMessageMap {
  [BACKGROUND_MESSAGE.getSettings]: {
    request: void;
    response: Settings;
  };
  [BACKGROUND_MESSAGE.updateSettings]: {
    request: Partial<Settings>;
    response: Settings;
  };
  [BACKGROUND_MESSAGE.ping]: {
    request: void;
    response: Result<"unavailable", { pongAt: number }>;
  };
}

export const backgroundMessageConfig = {
  [BACKGROUND_MESSAGE.getSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.updateSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.ping]: { requiresResponse: true },
} as const satisfies MessageConfigMap<BackgroundMessageMap>;

export type BackgroundMessageTarget = typeof MESSAGE_TARGET.background;
export type BackgroundMessageType = keyof BackgroundMessageMap;
