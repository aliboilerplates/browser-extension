import { afterEach, beforeEach } from "vite-plus/test";
import { fakeBrowser } from "wxt/testing/fake-browser";

beforeEach(() => {
  fakeBrowser.reset();
});

afterEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
  }
});
