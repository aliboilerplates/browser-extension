import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react"],
    categories: {
      correctness: "error",
      suspicious: "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // Beyond correctness/suspicious: core rules kept from the ESLint setup
      "prefer-const": "error",
      "no-var": "error",
      "no-empty": "error",
      "no-fallthrough": "error",
      "no-case-declarations": "error",
      "no-prototype-builtins": "error",
      "react/rules-of-hooks": "error",
      "typescript/ban-ts-comment": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-empty-object-type": "error",
      "typescript/no-misused-promises": "error",
      "typescript/no-unsafe-argument": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/only-throw-error": "error",
      "typescript/prefer-promise-reject-errors": "error",
      "typescript/require-await": "error",
      "typescript/restrict-plus-operands": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "typescript/prefer-optional-chain": "error",
      // React 17+ JSX transform doesn't need React in scope
      "react/react-in-jsx-scope": "off",
      // Messaging layer relies on deliberate generic casts
      "typescript/no-unsafe-type-assertion": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    ignorePatterns: [".output/**", ".wxt/**", "dist/**"],
  },
  fmt: {
    trailingComma: "es5",
    printWidth: 80,
    sortPackageJson: false,
    sortTailwindcss: {},
    ignorePatterns: [
      ".output/**",
      ".wxt/**",
      "dist/**",
      ".claude/**",
      "pnpm-lock.yaml",
    ],
  },
  staged: {
    "*": "vp check --fix",
  },
});
