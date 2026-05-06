# Web Clipper Notes — Example Overlay

A working notes feature that exercises every core system end to end:

- popup note creation and listing with filter + Zustand-backed UI state
- selected-text capture from the content script
- background command handlers and storage mutations
- context-menu integration
- toast feedback via `content/showToast`
- persisted notes and settings via `wxt/storage`

This folder is **not** part of the template's `src/`. To use it, copy the files
into `src/` and apply the small contract/storage merges below.

## Files

```text
examples/notes/
├── entrypoints/
│   ├── background/{demoNotes.handlers.ts, demoNotes.handlers.test.ts}
│   ├── content/{demoNotes.bridge.ts, demoNotes.selection.ts, demoNotes.selection.test.ts}
│   └── popup/{DemoNotesPanel.tsx, DemoNotesPanel.test.tsx}
├── shared/
│   ├── demo-notes.storage.ts
│   └── types/{note.ts, demoNotes.ts}
├── ui/stores/usePopupStore.ts
└── snippets/
    ├── messageConstants.diff.md
    ├── backgroundMessages.diff.md
    ├── storageItems.diff.md
    ├── background.index.diff.md
    └── popup.main.diff.md
```

## Restoration steps

Copy files into `src/`:

```text
examples/notes/entrypoints/background/*  → src/entrypoints/background/
examples/notes/entrypoints/content/*     → src/entrypoints/content/
examples/notes/entrypoints/popup/*       → src/entrypoints/popup/
examples/notes/shared/demo-notes.storage.ts → src/shared/
examples/notes/shared/types/*            → src/shared/types/
examples/notes/ui/stores/usePopupStore.ts → src/ui/stores/
```

Then apply the snippet merges:

1. **`src/core/messaging/messageConstants.ts`** — add the four `demoNotes/*`
   keys to `BACKGROUND_MESSAGE`. See [`snippets/messageConstants.diff.md`](./snippets/messageConstants.diff.md).
2. **`src/core/messaging/definitions/backgroundMessages.ts`** — add the four
   message map entries plus their config rows. Import `DemoNote` from
   `@/shared/types/demoNotes`. See [`snippets/backgroundMessages.diff.md`](./snippets/backgroundMessages.diff.md).
3. **`src/shared/types/index.ts`** — add `maxNotes: number` to `Settings`.
   See [`snippets/storageItems.diff.md`](./snippets/storageItems.diff.md).
4. **`src/core/storage/storageItems.ts`** — add `maxNotes: 100` to the
   `settingsStorage` fallback. Same snippet file.
5. **`src/entrypoints/background/messageListener.ts`** — wire the four demo
   handlers next to the core handlers. See the snippet linked above for the
   full list.
6. **`src/entrypoints/background/index.ts`** — paste the context-menu block
   inside the `defineBackground` callback. See [`snippets/background.index.diff.md`](./snippets/background.index.diff.md).
7. **`src/entrypoints/popup/PopupApp.tsx`** — replace the popup body with
   `<DemoNotesPanel />`. See [`snippets/popup.main.diff.md`](./snippets/popup.main.diff.md).
8. **`src/entrypoints/content/index.tsx`** — re-add the mouseup listener and
   save-selection button. See `snippets/popup.main.diff.md` (content section).

After all edits: `pnpm compile` should be clean and `pnpm dev` runs the demo.

## Notes

- The template's stripped `Settings` is `{ theme }`. After the overlay,
  `Settings` becomes `{ theme; maxNotes }`. No migration is needed for fresh
  installs.
- `usePopupStore` is the demo's filter-query store. It's only useful while
  the demo is active — drop it again if you remove the demo.
- The example tests are not run by the template's `pnpm test` (the
  `examples/**` folder is excluded from `tsconfig.json` and `eslint.config.mjs`,
  and Vitest scopes to `src/**`). Once you copy the test files into `src/`,
  they participate in the suite.
