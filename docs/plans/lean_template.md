# Lean Core Template + `examples/notes/` Overlay

## Overview

Strip the Web Clipper Notes demo out of `src/`, relocate it to `examples/notes/` as a
copy-pasteable overlay, and tighten the core around three demonstrated capabilities:
typed messaging (with content-tab routing built into the single `sendMessage`),
`wxt/storage` reactivity, and a minimal popup/options shell. Add a
`Result<TCode, TData, TErrorData>` type to `contracts.ts` for typed handler errors.
Rebalance tests so the core surface is well-covered without demo noise.

End state: zero demo references in `src/`. One public `sendMessage` auto-routes by
target. `contentTransport.ts` deleted. `examples/notes/` reproducible via README.
`pnpm test/compile/lint/build` green.

## Implementation Approach

Three phases. Demo extraction and messaging unification merge into one atomic
phase because they share too many touch points to split safely (live demo callers
use the old transport API; ripping them out cleanly requires moving demo code first).

1. **Phase 1 (atomic) — Demo out, messaging unified.** Move all demo files to
   `examples/notes/`. Rewrite `sendMessage.ts` with target-based routing. Delete
   `contentTransport.ts`. Slim `Settings`, entrypoints, message constants. Update
   tsconfig/eslint to exclude `examples/`.
2. **Phase 2 — `Result` type + `core/ping` example.** Add `Result` to
   `contracts.ts`. Add `core/ping` end-to-end (handler returning
   `Result<"unavailable", { pongAt: number }>`, popup button consuming it).
   Bulk up core tests.
3. **Phase 3 — Docs.** Write `examples/notes/README.md` overlay guide. Prune
   `README.md`. Update `docs/architecture.md`.

## Architecture

### `sendMessage.ts` (rewritten, single public entry)

```ts
export interface ContentRouteOptions { tabId?: number; frameId?: number }

export function sendMessage<T extends ResponseMessage>(
  type: T, ...args: SendArgs<T>
): Promise<RuntimeResponse<T>>;

export function sendMessage<T extends CommandMessage>(
  type: T, ...args: SendArgs<T>
): Promise<void>;
```

`SendArgs` is conditional on target — content messages accept optional
`ContentRouteOptions`, others don't. Internal helpers `resolveActiveTabId`,
`sendToContentTab`, `isConnectionError`, `wait`, retry constants live in the same
file. `sendToContentTab` is exported for tests but **not** re-exported from
`index.ts`.

Routing table:

| target | tabId | requiresResponse | behavior |
|-|-|-|-|
| background/offscreen | n/a | true | `browser.runtime.sendMessage` → `RuntimeResponse` |
| background/offscreen | n/a | false | `browser.runtime.sendMessage` → void |
| content | explicit or active-tab | either | `sendToContentTab` with retry |
| content | none, no active tab | true | return `toRuntimeFailure("No active tab…")` |
| content | none, no active tab | false | silent void |

**Failure-surface change:** retry exhaustion or "no active tab" returns
`RuntimeFailure` instead of throwing. This unifies how all targets surface failures.

### `contracts.ts` (additive)

```ts
export type Result<
  TCode extends string = string,
  TData extends object = object,
  TErrorData extends object = object,
> =
  | ({ ok: true } & TData)
  | { ok: false; error: { code: TCode } & TErrorData };
```

Doc-comment makes the **dual-`ok` layering** explicit. Outer `ok` (in
`RuntimeResponse`) = "did the message round-trip." Inner `ok` (in `Result`) = "did
the handler's domain logic succeed."

### Slimmed core

- `messageConstants.ts` — `BACKGROUND_MESSAGE` becomes `{ getSettings, updateSettings, ping }`.
- `definitions/backgroundMessages.ts` — adds `ping: { request: void; response: Result<"unavailable", { pongAt: number }> }`.
- `shared/types/index.ts` — `Settings` becomes `{ theme }`. `note.ts`/`demoNotes.ts` move to examples.
- `core/storage/storageItems.ts` — fallback drops `maxNotes`. `onboardingShownStorage` unchanged.
- `entrypoints/background/index.ts` — listener registration only.
- `entrypoints/background/messageListener.ts` — three handlers: `getSettings`, `updateSettings`, `ping`.
- `entrypoints/popup/main.tsx` — minimal shell: theme select + ping button + result display.
- `entrypoints/options/main.tsx` — theme dropdown only.
- `entrypoints/content/index.tsx` — shadow-root + toast listener only.
- `ui/stores/usePopupStore.ts` — **deleted** (sole field is demo-only `query`).
- `tests/helpers/factories.ts` — `createNote` removed; `createSettings` updated.

### Config exclusions

- `tsconfig.json` — add `"exclude": ["examples/**", "vitest.config.ts"]`.
- `eslint.config.mjs` — add `"examples/**"` to ignores.
- `vitest.config.ts` — already scoped to `src/**`.

### Test fixture cleanup

`maxNotes: 100` is hardcoded in 6 core test files. All must drop the field.

### `examples/notes/` layout

```text
examples/notes/
├── README.md
├── entrypoints/
│   ├── background/{demoNotes.handlers.ts, demoNotes.handlers.test.ts}
│   ├── content/{demoNotes.bridge.ts, demoNotes.selection.ts, demoNotes.selection.test.ts}
│   └── popup/{DemoNotesPanel.tsx, DemoNotesPanel.test.tsx}
├── shared/{demo-notes.storage.ts, types/{note.ts, demoNotes.ts}}
├── ui/stores/usePopupStore.ts
└── snippets/
    ├── messageConstants.diff.md
    ├── backgroundMessages.diff.md
    ├── storageItems.diff.md
    ├── background.index.diff.md
    └── popup.main.diff.md
```

## Key Decisions

1. **One unified `sendMessage`** — collapses transport into `getMessageTarget`-driven routing.
2. **Failure-surface change: `RuntimeFailure` instead of throwing.** Unifies surface across all targets.
3. **`Result.error.code` not `.type`** — `request.type` already owns "type" in this codebase.
4. **`Result<TCode, TData, TErrorData>` parameter order** — `TCode` first, all default sensibly.
5. **Phases 1 (demo) + messaging unification merge** — atomic; can't be split safely.
6. **`usePopupStore` deleted** — sole field is demo-only.
7. **`content/showToast` stays in core** — generic capability.
8. **Context menu removed entirely** — any neutral example is hollow.
9. **Overlay folder, not patch or workspace** — readable, copy-paste unambiguous.
10. **`core/ping` returns `Result<"unavailable", { pongAt: number }>`** — must teach the error branch.
11. **No storage migration for `maxNotes`** — fresh-install template assumption.

## Test Strategy

**Levels:** unit (no browser), integration with `fakeBrowser`, component (jsdom + RTL),
demo tests live under `examples/` (not run by `pnpm test`).

**TDD sequence:**

1. `Result` type assertions (3 shapes).
2–9. `sendMessage` routing — background payload-less; command vs response; content with explicit tabId; content with active-tab fallback; content no-active-tab (response failure, command silent); retry on connection error; retry exhaustion; non-connection error.
10–14. `createMessageListener` — handler-not-found; wrong target; handler throws; missing-response; fire-and-forget.
15–17. `messageMetadata` — `getMessageTarget`; `requiresResponse`; `isKnownMessageType`.
18–20. `useStorageItem` — watch propagates; unmount cleanup; update writes.
21. `messageUtils.isRuntimeRequestForTarget` — non-object/array cases.
22. Popup smoke test — theme select + ping button.

## Goals

- Core has zero demo-domain references.
- One `sendMessage` for all targets; `contentTransport.ts` deleted.
- `Result` added and demonstrated in `core/ping` with explicit dual-`ok` doc.
- Example overlay reproducible via README.
- `pnpm test/compile/lint/build` green.
- Messaging coverage strictly better than today.

## Non-Goals

- New core capabilities (sidePanel, real offscreen, IndexedDB).
- Architecture changes to typed-target contracts.
- Dep upgrades.
- Overlay automation (no codegen, no install script).
- `maxNotes` backwards compat for existing installs.
