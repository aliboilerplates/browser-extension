import { browser } from "wxt/browser";
import {
  type AppMessageType,
  type RequestPayload,
  type RequiresResponse,
  type RuntimeRequest,
  type RuntimeResponse,
} from "./contracts";
import { getMessageTarget, requiresResponse } from "./messageMetadata";

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

type MessageArgs<TType extends AppMessageType> =
  RequestPayload<TType> extends void ? [] : [payload: RequestPayload<TType>];

export function sendMessage<TType extends ResponseMessage>(
  type: TType,
  ...args: MessageArgs<TType>
): Promise<RuntimeResponse<TType>>;

export function sendMessage<TType extends CommandMessage>(
  type: TType,
  ...args: MessageArgs<TType>
): Promise<void>;

export async function sendMessage<TType extends AppMessageType>(
  type: TType,
  ...args: MessageArgs<TType>
): Promise<RuntimeResponse<TType> | void> {
  const request: RuntimeRequest<TType> = {
    type,
    target: getMessageTarget(type),
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    payload: args[0] as RequestPayload<TType>,
  };

  if (!requiresResponse(type)) {
    await browser.runtime.sendMessage(request);
    return;
  }

  return browser.runtime.sendMessage<
    RuntimeRequest<TType>,
    RuntimeResponse<TType>
  >(request);
}
