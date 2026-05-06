# `src/entrypoints/background/index.ts`

Add the context-menu wiring inside `defineBackground`:

```ts
import { defineBackground } from "wxt/utils/define-background";
import { browser } from "wxt/browser";
import { supportsContextMenus } from "@/core/browser/capabilities";
import { sendMessage } from "@/core/messaging";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import { backgroundMessageListener } from "./messageListener";

export default defineBackground(() => {
  // Listener registration must remain synchronous in MV3 service workers.
  browser.runtime.onMessage.addListener(backgroundMessageListener);

  // Demo overlay: context-menu integration for "Save selection as note".
  if (supportsContextMenus()) {
    browser.runtime.onInstalled.addListener(() => {
      void browser.contextMenus.create({
        id: "demo-notes-save-selection",
        title: "Save selection as note",
        contexts: ["selection"],
      });
    });

    browser.contextMenus.onClicked.addListener((info) => {
      const selectionText = info.selectionText;
      if (info.menuItemId !== "demo-notes-save-selection" || !selectionText) {
        return;
      }

      void demoNotesStorage.getValue().then(async (notes) => {
        await demoNotesStorage.setValue([
          {
            id: crypto.randomUUID(),
            text: selectionText,
            source: "context-menu",
            createdAt: Date.now(),
          },
          ...notes,
        ]);
        const response = await sendMessage("content/showToast", {
          message: "Saved selection from context menu",
        });
        // Content scripts may be unavailable on restricted pages; sendMessage
        // returns a RuntimeFailure rather than throwing — discard it silently.
        void response;
      });
    });
  }
});
```

> Note: with the unified `sendMessage`, content delivery failures return
> `RuntimeFailure` instead of throwing. The previous `try/catch` is no longer
> needed; you can branch on `response.ok` if you want to surface the failure.
