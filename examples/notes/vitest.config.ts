import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  plugins: [WxtVitest()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [resolve(rootDir, "tests/setup.ts")],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60
      }
    }
  }
});
