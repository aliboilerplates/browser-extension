import { browser } from "wxt/browser";
import { backgroundLogger } from "@/core/logging/logger";
import {
  type AppMessageType,
  getContract,
  type MessageTypeForTarget,
  type RuntimeRequest,
  type RuntimeResponse,
} from "./contracts";
import { MessagingTimeoutError } from "./errors";

export interface SendContentMessageOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

const DEFAULT_OPTIONS: Required<SendContentMessageOptions> = {
  maxRetries: 4,
  retryDelayMs: 100,
  timeoutMs: 3_000,
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
  const contract = getContract(type);
  const request: RuntimeRequest<TType> = {
    type,
    target: contract.target,
    payload,
  };

  let attempt = 0;

  while (true) {
    try {
      const responsePromise = browser.tabs.sendMessage<
        RuntimeRequest<TType>,
        RuntimeResponse<TType>
      >(tabId, request);

      const response = await Promise.race([
        responsePromise,
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(
              new MessagingTimeoutError(
                `${String(type)} timed out after ${settings.timeoutMs}ms`
              )
            );
          }, settings.timeoutMs);
        }),
      ]);

      if (contract.requiresResponse && response && !response.ok) {
        throw new Error(response.error.message);
      }

      if (contract.requiresResponse) {
        return (response as Exclude<typeof response, { ok: false }>).data;
      }

      return undefined;
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
