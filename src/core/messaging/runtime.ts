import { browser } from "wxt/browser";
import { MessagingTimeoutError } from "./errors";
import {
  type AppMessageType,
  getContract,
  type RequestPayload,
  type RequiresResponse,
  type RuntimeRequest,
  type RuntimeResponse,
  type RuntimeSuccess,
} from "./contracts";

type SendOptions = {
  timeoutMs?: number;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new MessagingTimeoutError(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    void promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export async function sendRuntimeMessage<TType extends AppMessageType>(
  type: TType,
  payload: RequestPayload<TType>,
  options: SendOptions = {}
): Promise<RequiresResponse<TType> extends true ? RuntimeSuccess<TType>["data"] : void> {
  const contract = getContract(type);
  const request: RuntimeRequest<TType> = {
    type,
    target: contract.target,
    payload,
  };

  if (!contract.requiresResponse) {
    await browser.runtime.sendMessage(request);
    return undefined as RequiresResponse<TType> extends true
      ? RuntimeSuccess<TType>["data"]
      : void;
  }

  const timeoutMs = options.timeoutMs ?? contract.defaultTimeoutMs ?? 3_000;
  const responsePromise = browser.runtime.sendMessage<
    RuntimeRequest<TType>,
    RuntimeResponse<TType>
  >(request);
  const response = await withTimeout(responsePromise, timeoutMs, String(type));

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data as RequiresResponse<TType> extends true
    ? RuntimeSuccess<TType>["data"]
    : void;
}

