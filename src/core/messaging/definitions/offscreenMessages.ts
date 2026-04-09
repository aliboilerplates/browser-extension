import type { MessageConfigMap } from "../contracts";
import { MESSAGE_TARGET, OFFSCREEN_MESSAGE } from "../messageConstants";

export interface OffscreenMessageMap {
  [OFFSCREEN_MESSAGE.ping]: {
    request: void;
    response: { ok: true };
  };
}

export const offscreenMessageConfig = {
  [OFFSCREEN_MESSAGE.ping]: { requiresResponse: true },
} as const satisfies MessageConfigMap<OffscreenMessageMap>;

export type OffscreenMessageTarget = typeof MESSAGE_TARGET.offscreen;
export type OffscreenMessageType = keyof OffscreenMessageMap;
