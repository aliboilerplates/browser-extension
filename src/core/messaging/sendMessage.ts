import { browser } from "wxt/browser";
import { backgroundLogger } from "@/core/logging/logger";
import {
  type AppMessageType,
  type RequestPayload,
  type RequiresResponse,
  type RuntimeRequest,
  type RuntimeResponse,
  type TargetForMessage,
} from "./contracts";
import { MESSAGE_TARGET } from "./messageConstants";
import { getMessageTarget, requiresResponse } from "./messageMetadata";
import { toRuntimeFailure } from "./messageUtils";

export interface ContentRouteOptions {
  /** Target a specific tab. When omitted, the active tab in the current window is used. */
  tabId?: number;
  /** Target a specific frame within the tab. */
  frameId?: number;
}

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 100;

type ResponseMessage = {
  [TType in AppMessageType]: RequiresResponse<TType> extends true
    ? TType
    : never;
}[AppMessageType];

type CommandMessage = {
  [TType in AppMessageType]: RequiresResponse<TType> extends false
    ? TType
    : never;
}[AppMessageType];

type ContentTarget = typeof MESSAGE_TARGET.content;

type SendArgs<TType extends AppMessageType> =
  TargetForMessage<TType> extends ContentTarget
    ? RequestPayload<TType> extends void
      ? [payload?: undefined, options?: ContentRouteOptions]
      : [payload: RequestPayload<TType>, options?: ContentRouteOptions]
    : RequestPayload<TType> extends void
      ? []
      : [payload: RequestPayload<TType>];

export function sendMessage<TType extends ResponseMessage>(
  type: TType,
  ...args: SendArgs<TType>
): Promise<RuntimeResponse<TType>>;

export function sendMessage<TType extends CommandMessage>(
  type: TType,
  ...args: SendArgs<TType>
): Promise<void>;

export async function sendMessage<TType extends AppMessageType>(
  type: TType,
  ...args: unknown[]
): Promise<RuntimeResponse<TType> | void> {
  const target = getMessageTarget(type);
  const request: RuntimeRequest<TType> = {
    type,
    target,
     
    payload: args[0] as RequestPayload<TType>,
  };

  if (target === MESSAGE_TARGET.content) {
    const options = args[1] as ContentRouteOptions | undefined;
    let tabId = options?.tabId;

    if (tabId === undefined) {
      tabId = await resolveActiveTabId();

      if (tabId === undefined) {
        if (!requiresResponse(type)) {
          return;
        }
        return toRuntimeFailure(
          new Error("No active tab available for content message delivery")
        ) as RuntimeResponse<TType>;
      }
    }

    return sendToContentTab(tabId, request, options?.frameId);
  }

  if (!requiresResponse(type)) {
    await browser.runtime.sendMessage(request);
    return;
  }

  return browser.runtime.sendMessage<
    RuntimeRequest<TType>,
    RuntimeResponse<TType>
  >(request);
}

export async function resolveActiveTabId(): Promise<number | undefined> {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab?.id;
}

/**
 * Sends a request to a content script and retries on connection errors caused
 * by a not-yet-injected content script. Internal to the messaging module —
 * callers should use `sendMessage` instead. Exported only for testing.
 */
export async function sendToContentTab<TType extends AppMessageType>(
  tabId: number,
  request: RuntimeRequest<TType>,
  frameId?: number
): Promise<RuntimeResponse<TType> | void> {
  const tabsOptions =
    frameId === undefined ? undefined : { frameId };
  const expectsResponse = requiresResponse(request.type);
  let attempt = 0;

  while (true) {
    try {
      if (!expectsResponse) {
        await browser.tabs.sendMessage(tabId, request, tabsOptions);
        return;
      }

      return await browser.tabs.sendMessage<
        RuntimeRequest<TType>,
        RuntimeResponse<TType>
      >(tabId, request, tabsOptions);
    } catch (error) {
      if (!isConnectionError(error) || attempt >= MAX_RETRIES) {
        if (!expectsResponse) {
          return;
        }
        return toRuntimeFailure(error) as RuntimeResponse<TType>;
      }

      attempt += 1;
      backgroundLogger.info("Retrying content message delivery", {
        tabId,
        type: request.type,
        attempt,
      });
      await wait(RETRY_DELAY_MS);
    }
  }
}

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return [
    "Could not establish connection",
    "Receiving end does not exist",
    "The message port closed",
  ].some((message) => error.message.includes(message));
}

async function wait(delayMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}
