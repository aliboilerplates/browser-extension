# `src/shared/types/index.ts`

Extend `Settings` with `maxNotes`:

```ts
export type ThemePreference = "light" | "dark" | "system";

export interface Settings {
  theme: ThemePreference;
  maxNotes: number; // demo overlay
}
```

# `src/core/storage/storageItems.ts`

Add `maxNotes` to the fallback:

```ts
import type { Settings } from "@/shared/types";
import { storage } from "wxt/utils/storage";

export const settingsStorage = storage.defineItem<Settings>("local:settings", {
  fallback: {
    theme: "system",
    maxNotes: 100, // demo overlay
  },
  version: 1,
});
```

> Bumping `version` and adding a migration is only needed if you have
> production users with persisted settings missing `maxNotes`.
