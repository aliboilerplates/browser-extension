import { defineBackground } from "wxt/utils/define-background";
import { browser } from "wxt/browser";
import { backgroundMessageListener } from "./messageListener";

export default defineBackground(() => {
  // Listener registration must remain synchronous in MV3 service workers.
  browser.runtime.onMessage.addListener(backgroundMessageListener);
});
