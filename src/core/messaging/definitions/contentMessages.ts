import type { MessageConfigMap } from "../contracts";
import { CONTENT_MESSAGE, MESSAGE_TARGET } from "../messageConstants";

export interface ContentMessageMap {
  [CONTENT_MESSAGE.showToast]: {
    request: { message: string };
    response: void;
  };
}

export const contentMessageConfig = {
  [CONTENT_MESSAGE.showToast]: { requiresResponse: false },
} as const satisfies MessageConfigMap<ContentMessageMap>;

export type ContentMessageTarget = typeof MESSAGE_TARGET.content;
export type ContentMessageType = keyof ContentMessageMap;
