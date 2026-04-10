import { browser } from "wxt/browser";

export const isFirefox = () => import.meta.env.FIREFOX === true;
export const isChrome = () => !isFirefox();

function getChromeLike() {
  return ("chrome" in globalThis ? (globalThis as typeof globalThis & {
    chrome?: Record<string, unknown>;
  }).chrome : undefined);
}

export const supportsOffscreen = () =>
  isChrome() && getChromeLike() !== undefined && "offscreen" in getChromeLike()!;

export const supportsSidePanel = () =>
  isChrome() && getChromeLike() !== undefined && "sidePanel" in getChromeLike()!;

export const supportsContextMenus = () =>
  browser?.contextMenus !== undefined;
