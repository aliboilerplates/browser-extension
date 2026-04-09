import { useState } from "react";
import { sendMessage } from "@/core/messaging";
import type {
  AppMessageType,
  RequestPayload,
  RequiresResponse,
  RuntimeResponse,
} from "@/core/messaging";

type ResponseMessageType = {
  [TType in AppMessageType]: RequiresResponse<TType> extends true
    ? TType
    : never;
}[AppMessageType];

type SendArgs<TType extends ResponseMessageType> =
  RequestPayload<TType> extends void ? [] : [payload: RequestPayload<TType>];

const sendResponseMessage = sendMessage as <
  TType extends ResponseMessageType,
>(
  type: TType,
  ...args: SendArgs<TType>
) => Promise<RuntimeResponse<TType>>;

export function useMessage<TType extends ResponseMessageType>(type: TType) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(...args: SendArgs<TType>) {
    setLoading(true);
    setError(null);

    try {
      const response = await sendResponseMessage(type, ...args);

      if (!response.ok) {
        setError(response.error.message);
      }

      return response;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unknown message failure";
      setError(message);
      throw caughtError;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    send,
  } as const;
}
