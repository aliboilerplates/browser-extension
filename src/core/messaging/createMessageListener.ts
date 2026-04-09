import type { Browser } from "wxt/browser";
import {
  type MessageTarget,
  type MessageTypeForTarget,
  type RuntimeRequest,
  type RuntimeResponse,
} from "./contracts";
import { requiresResponse } from "./messageMetadata";
import { isRuntimeRequestForTarget, toRuntimeFailure } from "./messageUtils";

export type HandlerMap<TTarget extends MessageTarget> = {
  [TType in MessageTypeForTarget<TTarget>]?: (
    message: RuntimeRequest<TType>,
    sender: Browser.runtime.MessageSender
  ) => Promise<RuntimeResponse<TType> | void> | RuntimeResponse<TType> | void;
};

export function createRuntimeMessageListener<TTarget extends MessageTarget>(
  target: TTarget,
  handlers: HandlerMap<TTarget>
) {
  return (
    message: unknown,
    sender: Browser.runtime.MessageSender,
    sendResponse: (
      response?: RuntimeResponse<MessageTypeForTarget<TTarget>>
    ) => void
  ) => {
    if (!isRuntimeRequestForTarget(target, message)) {
      return;
    }

    const handler = handlers[message.type] as
      | ((
          message: RuntimeRequest<MessageTypeForTarget<TTarget>>,
          sender: Browser.runtime.MessageSender
        ) =>
          | Promise<RuntimeResponse<MessageTypeForTarget<TTarget>> | void>
          | RuntimeResponse<MessageTypeForTarget<TTarget>>
          | void)
      | undefined;

    if (!handler) {
      sendResponse(
        toRuntimeFailure(
          new Error(`No handler registered for ${String(message.type)}`)
        )
      );
      return true;
    }

    const result = Promise.resolve(handler(message, sender))
      .then((response) => {
        if (requiresResponse(message.type)) {
          sendResponse(
            (response ??
              toRuntimeFailure(
                new Error("Missing response")
              )) as RuntimeResponse<MessageTypeForTarget<TTarget>>
          );
        }
      })
      .catch((error: unknown) => {
        if (requiresResponse(message.type)) {
          sendResponse(
            toRuntimeFailure(error) as RuntimeResponse<
              MessageTypeForTarget<TTarget>
            >
          );
        }
      });

    void result;

    if (requiresResponse(message.type)) {
      return true;
    }
  };
}
