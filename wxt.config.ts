import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  browser: "chrome",
  imports: false,
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    version: "0.1.0",
    default_locale: "en",
    permissions: ["storage", "activeTab", "contextMenus"],
    options_ui: {
      page: "options.html",
      open_in_tab: true,
    },
    browser_specific_settings: {
      gecko: {
        id: "template@example.com",
        strict_min_version: "113.0",
      },
    },
  },
  hooks: {
    "build:before": (wxt) => {
      if (wxt.config.browser === "firefox") {
        wxt.config.manifest.permissions = ["storage", "activeTab", "contextMenus"];
      }
    },
  },
});

