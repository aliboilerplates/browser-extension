import { createRuntimeMessageListener, MESSAGE_TARGET } from "@/core/messaging";

export function createContentMessageListener(onToast: (message: string) => void) {
  return createRuntimeMessageListener(MESSAGE_TARGET.content, {
    "content/showToast": (message) => {
      onToast(message.payload.message);
    },
  });
}
