import { useState } from "react";
import { sendRuntimeMessage } from "@/core/messaging";
import type { AppMessageType, RequestPayload, ResponsePayload } from "@/core/messaging";

export function useMessage<TType extends AppMessageType>(type: TType) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(payload: RequestPayload<TType>) {
    setLoading(true);
    setError(null);

    try {
      return await sendRuntimeMessage(type, payload) as ResponsePayload<TType>;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unknown message failure";
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

