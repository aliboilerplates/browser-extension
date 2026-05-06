import { defineBackground } from "wxt/utils/define-background";
import { browser } from "wxt/browser";
import { supportsContextMenus } from "@/core/browser/capabilities";
import { sendMessage } from "@/core/messaging";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import { backgroundMessageListener } from "./messageListener";

export default defineBackground(() => {
  // Listener registration must remain synchronous in MV3 service workers.
  browser.runtime.onMessage.addListener(backgroundMessageListener);

  // Demo: context-menu integration for "Save selection as note".
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
        // sendMessage returns void for command-style content messages and
        // does not throw on delivery failure (it surfaces RuntimeFailure for
        // response-style messages instead). Fire-and-forget is safe here.
        await sendMessage("content/showToast", {
          message: "Saved selection from context menu",
        });
      });
    });
  }
});
