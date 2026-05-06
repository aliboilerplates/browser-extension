import eslintjs from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default defineConfig([
  reactHooks.configs.flat.recommended,
  eslintjs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs.unopinionated,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    files: ["**/*.{ts,tsx}"],
    ignores: [".output/**", ".wxt/**", "dist/**", "examples/**"],
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
  },
]);
