import { backgroundMessageConfig } from "./definitions/backgroundMessages";
import { contentMessageConfig } from "./definitions/contentMessages";
import type {
  AppMessageType,
  RequiresResponse,
  TargetForMessage,
} from "./contracts";
import {
  BACKGROUND_MESSAGE,
  CONTENT_MESSAGE,
  MESSAGE_TARGET,
  OFFSCREEN_MESSAGE,
} from "./messageConstants";
import { offscreenMessageConfig } from "./definitions/offscreenMessages";

const messageConfig = {
  ...backgroundMessageConfig,
  ...contentMessageConfig,
  ...offscreenMessageConfig,
} as const;

export function isKnownMessageType(value: unknown): value is AppMessageType {
  if (typeof value !== "string") {
    return false;
  }

  return (
    (Object.values(BACKGROUND_MESSAGE) as readonly string[]).includes(value) ||
    (Object.values(CONTENT_MESSAGE) as readonly string[]).includes(value) ||
    (Object.values(OFFSCREEN_MESSAGE) as readonly string[]).includes(value)
  );
}

export function getMessageTarget<TType extends AppMessageType>(
  type: TType
): TargetForMessage<TType> {
  if ((Object.values(CONTENT_MESSAGE) as readonly string[]).includes(type)) {
    return MESSAGE_TARGET.content as TargetForMessage<TType>;
  }

  if ((Object.values(OFFSCREEN_MESSAGE) as readonly string[]).includes(type)) {
    return MESSAGE_TARGET.offscreen as TargetForMessage<TType>;
  }

  return MESSAGE_TARGET.background as TargetForMessage<TType>;
}

export function requiresResponse<TType extends AppMessageType>(
  type: TType
): RequiresResponse<TType> {
  return messageConfig[type].requiresResponse as RequiresResponse<TType>;
}
