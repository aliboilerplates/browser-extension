import type { Browser } from "wxt/browser";
import { getContract, isKnownMessageType, MESSAGE_TARGET, type AppMessageType, type MessageTarget, type MessageTypeForTarget, type RuntimeRequest, type RuntimeResponse } from "./contracts";
import { toRuntimeFailure } from "./errors";

type HandlerMap<TTarget extends MessageTarget> = {
  [TType in MessageTypeForTarget<TTarget>]?: (
    message: RuntimeRequest<TType>,
    sender: Browser.runtime.MessageSender
  ) => Promise<RuntimeResponse<TType> | void> | RuntimeResponse<TType> | void;
};

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

  return getContract(message.type).target === target;
}

export function createRuntimeMessageListener<TTarget extends MessageTarget>(
  target: TTarget,
  handlers: HandlerMap<TTarget>
) {
  return (
    message: unknown,
    sender: Browser.runtime.MessageSender,
    sendResponse: (response?: RuntimeResponse<MessageTypeForTarget<TTarget>>) => void
  ) => {
    if (!isRuntimeRequestForTarget(target, message)) {
      return;
    }

    const handler = handlers[message.type] as
      | ((
          message: RuntimeRequest<AppMessageType>,
          sender: Browser.runtime.MessageSender
        ) => Promise<RuntimeResponse<AppMessageType> | void> | RuntimeResponse<AppMessageType> | void)
      | undefined;

    if (!handler) {
      sendResponse(toRuntimeFailure(new Error(`No handler registered for ${String(message.type)}`)));
      return true;
    }

    const contract = getContract(message.type);

    const result = Promise.resolve(handler(message, sender)).then((response) => {
      if (contract.requiresResponse) {
        sendResponse((response ?? toRuntimeFailure(new Error("Missing response"))) as RuntimeResponse<MessageTypeForTarget<TTarget>>);
      }
    }).catch((error: unknown) => {
      if (contract.requiresResponse) {
        sendResponse(toRuntimeFailure(error) as RuntimeResponse<MessageTypeForTarget<TTarget>>);
      }
    });

    void result;

    if (contract.requiresResponse) {
      return true;
    }
  };
}

export const isBackgroundMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.background, message);

export const isContentMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.content, message);

export const isOffscreenMessage = (message: unknown) =>
  isRuntimeRequestForTarget(MESSAGE_TARGET.offscreen, message);
