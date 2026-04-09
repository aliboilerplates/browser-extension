import { browser } from "wxt/browser";

export const isFirefox = () => import.meta.env.FIREFOX === true;
export const isChrome = () => !isFirefox();

function getChromeLike() {
  return ("chrome" in globalThis ? (globalThis as typeof globalThis & {
    chrome?: Record<string, unknown>;
  }).chrome : undefined);
}

export const supportsOffscreen = () =>
  isChrome() && typeof getChromeLike() !== "undefined" && "offscreen" in getChromeLike()!;

export const supportsSidePanel = () =>
  isChrome() && typeof getChromeLike() !== "undefined" && "sidePanel" in getChromeLike()!;

export const supportsContextMenus = () =>
  typeof browser !== "undefined" && typeof browser.contextMenus !== "undefined";
