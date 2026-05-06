import { type MessageTarget, type MessageTypeForTarget, type RuntimeRequest } from "./contracts";
import { MESSAGE_TARGET } from "./messageConstants";
import { getMessageTarget, isKnownMessageType } from "./messageMetadata";

export function toRuntimeFailure(error: unknown) {
  if (error instanceof Error) {
    return {
      ok: false,
      error: {
        message: error.message,
      },
    } as const;
  }

  return {
    ok: false,
    error: {
      message: "Unknown messaging error",
    },
  } as const;
}

export function isRuntimeRequestForTarget<TTarget extends MessageTarget>(
  target: TTarget,
  message: unknown
): message is RuntimeRequest<MessageTypeForTarget<TTarget>> {
  if (typeof message !== "object" || message === null || Array.isArray(message)) {
    return false;
  }

  if (!("type" in message) || !("target" in message)) {
    return false;
  }

  if (!isKnownMessageType(message.type) || message.target !== target) {
    return false;
  }

  return getMessageTarget(message.type) === target;
}

export const isBackgroundMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.background, message);

export const isContentMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.content, message);

export const isOffscreenMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.offscreen, message);
