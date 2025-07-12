import { ScreenshotMessage } from "@/shared/interfaces/messages.interface";

export function sendRuntimeMessage<R = unknown>(
  message: ScreenshotMessage,
): Promise<R> {
  return browser.runtime.sendMessage<ScreenshotMessage, R>(message);
}
