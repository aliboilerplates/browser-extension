import { browser } from "wxt/browser";

// Vitest exposes env flags as strings ("false"), so compare explicitly
// oxlint-disable-next-line typescript/no-unnecessary-boolean-literal-compare
export const isFirefox = () => import.meta.env.FIREFOX === true;
export const isChrome = () => !isFirefox();

function getChromeLike() {
  return "chrome" in globalThis
    ? (
        globalThis as typeof globalThis & {
          chrome?: Record<string, unknown>;
        }
      ).chrome
    : undefined;
}

export const supportsOffscreen = () =>
  isChrome() &&
  getChromeLike() !== undefined &&
  "offscreen" in getChromeLike()!;

export const supportsSidePanel = () =>
  isChrome() &&
  getChromeLike() !== undefined &&
  "sidePanel" in getChromeLike()!;

export const supportsContextMenus = () => browser?.contextMenus !== undefined;
