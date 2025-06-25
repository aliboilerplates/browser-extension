import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import zip from "vite-plugin-zip-pack";
import { name, version } from "./package.json";
import manifest from "./manifest.config";
// https://vitejs.dev/config/
const viteConfig = defineViteConfig({
  plugins: [
    tailwindcss(),
    react(),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: `crx-${name}-${version}.zip` }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  resolve: {
    alias: {
      "@": path.join(import.meta.dirname, "src"),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/vitest.setup.ts"],
    restoreMocks: true,
  },
});

export default mergeConfig(viteConfig, vitestConfig);
