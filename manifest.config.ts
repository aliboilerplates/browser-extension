import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  name: pkg.name,
  version: pkg.version,
  manifest_version: 3,
  description: pkg.description,
  icons: {
    48: "public/logo.png",
  },

  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },

  content_scripts: [
    {
      js: ["src/content/index.ts"],
      matches: ["https://*/*"],
    },
  ],

  background: {
    service_worker: "src/background/index.ts",
  },
});
