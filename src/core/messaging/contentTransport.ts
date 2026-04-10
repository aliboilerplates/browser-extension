import { browser } from "wxt/browser";
import { backgroundLogger } from "@/core/logging/logger";
import {
  type MessageTypeForTarget,
  type RuntimeRequest,
  type RuntimeResponse,
} from "./contracts";
import { getMessageTarget, requiresResponse } from "./messageMetadata";

export interface SendContentMessageOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<SendContentMessageOptions> = {
  maxRetries: 4,
  retryDelayMs: 100,
};

function isConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return [
    "Could not establish connection",
    "Receiving end does not exist",
    "The message port closed",
  ].some((message) => error.message.includes(message));
}

async function wait(delayMs: number) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function sendMessageToTabInternal<
  TType extends MessageTypeForTarget<"CONTENT">,
>(
  tabId: number,
  type: TType,
  payload: RuntimeRequest<TType>["payload"],
  options: SendContentMessageOptions = {}
) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const request: RuntimeRequest<TType> = {
    type,
    target: getMessageTarget(type),
    payload,
  };

  let attempt = 0;

  while (true) {
    try {
      const responsePromise = browser.tabs.sendMessage<
        RuntimeRequest<TType>,
        RuntimeResponse<TType>
      >(tabId, request);
      const response = await responsePromise;

      if (requiresResponse(type) && response && !response.ok) {
        throw new Error(response.error.message);
      }

      if (requiresResponse(type)) {
        return (response as Exclude<typeof response, { ok: false }>).data;
      }

      return;
    } catch (error) {
      // Tabs can reject while the content script is still loading or not yet injected.
      if (!isConnectionError(error) || attempt >= settings.maxRetries) {
        throw error;
      }

      attempt += 1;
      backgroundLogger.info("Retrying content message delivery", {
        tabId,
        type,
        attempt,
      });
      await wait(settings.retryDelayMs);
    }
  }
}

export async function sendMessageToTab<
  TType extends MessageTypeForTarget<"CONTENT">,
>(
  tabId: number,
  type: TType,
  payload: RuntimeRequest<TType>["payload"],
  options: SendContentMessageOptions = {}
) {
  return sendMessageToTabInternal(tabId, type, payload, options);
}

export async function sendMessageToActiveTab<
  TType extends MessageTypeForTarget<"CONTENT">,
>(
  type: TType,
  payload: RuntimeRequest<TType>["payload"],
  options: SendContentMessageOptions = {}
) {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!activeTab?.id) {
    throw new Error("No active tab available for content message delivery");
  }

  return sendMessageToTabInternal(activeTab.id, type, payload, options);
}
