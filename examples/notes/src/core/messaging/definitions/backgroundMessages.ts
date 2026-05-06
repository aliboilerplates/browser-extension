import type { Settings } from "@/shared/types";
import type { DemoNote } from "@/shared/types/demoNotes";
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
  [BACKGROUND_MESSAGE.getNotes]: {
    request: void;
    response: DemoNote[];
  };
  [BACKGROUND_MESSAGE.createNote]: {
    request: { text: string; source: DemoNote["source"] };
    response: DemoNote;
  };
  [BACKGROUND_MESSAGE.deleteNote]: {
    request: { id: string };
    response: void;
  };
  [BACKGROUND_MESSAGE.saveSelectedText]: {
    request: { text: string };
    response: void;
  };
}

export const backgroundMessageConfig = {
  [BACKGROUND_MESSAGE.getSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.updateSettings]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.ping]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.getNotes]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.createNote]: { requiresResponse: true },
  [BACKGROUND_MESSAGE.deleteNote]: { requiresResponse: false },
  [BACKGROUND_MESSAGE.saveSelectedText]: { requiresResponse: false },
} as const satisfies MessageConfigMap<BackgroundMessageMap>;

export type BackgroundMessageTarget = typeof MESSAGE_TARGET.background;
export type BackgroundMessageType = keyof BackgroundMessageMap;
