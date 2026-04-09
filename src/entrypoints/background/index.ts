import { defineBackground } from "wxt/utils/define-background";
import { browser } from "wxt/browser";
import { supportsContextMenus } from "@/core/browser/capabilities";
import { sendMessageToActiveTab } from "@/core/messaging";
import { demoNotesStorage } from "@/shared/demo-notes.storage";
import { backgroundMessageListener } from "./messageListener";

export default defineBackground(() => {
  // Listener registration must remain synchronous in MV3 service workers.
  browser.runtime.onMessage.addListener(backgroundMessageListener);

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
        try {
          await sendMessageToActiveTab("content/showToast", {
            message: "Saved selection from context menu",
          });
        } catch {
          // Content scripts may be unavailable on restricted or not-yet-ready pages.
        }
      });
    });
  }
});
