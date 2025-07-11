import { ScreenshotMessage } from "@/shared/interfaces/messages.interface";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message: ScreenshotMessage) => {
    console.log("Received message:", message);
    return "Hello from background!";
  });
});
