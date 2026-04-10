# Architecture

This document describes the architectural decisions behind the template and the
rules that keep multi-context extensions maintainable as they grow.

## Guiding Principles

- One message has one intended receiver context.
- Background owns workflow orchestration.
- Business-state mutations go through background commands.
- Preferences can be written directly with `wxt/storage`.
- Content owns local DOM interaction logic.
- Popup and options own UI composition state.
- Offscreen is optional and only used for capabilities that need it.

## Messaging

The template ships with a custom, typed messaging layer instead of a generic
wrapper. Messaging is the single most important reusable piece of a multi-context
extension, and keeping it in-repo makes it easy to evolve without fighting a
third-party abstraction.

The messaging layer provides:

- typed target maps
- typed message maps per receiver
- typed request/response payloads
- central routing in background
- listener helpers for background, content, and offscreen
- automatic response handling from message contract metadata
- optional timeout support
- retry support for content-tab delivery

The messaging layer intentionally omits:

- message builder indirection
- async message registries
- caller-managed `keepChannelOpen`
- transport-level debouncing

## Storage

Use `wxt/storage` as the default persistence layer.

Write rules:

- **Preferences / settings**: direct writes allowed from any context.
- **Business or workflow state**: background only, via message commands.
- **Ephemeral UI state**: Zustand or local component state.

IndexedDB is not part of the base path. Add it only when a feature genuinely
needs it.

## Entrypoint Ownership

| Context        | Owns                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `background/`  | workflow orchestration, business-state mutations, message routing    |
| `content/`     | DOM interaction, Shadow DOM UI, selection and page-local logic       |
| `popup/`       | popup UI composition, popup-local state                              |
| `options/`     | options page UI, preference editing                                  |
| `offscreen/`   | optional scaffolding for capabilities that require an offscreen doc  |

## Testing

Testing is a first-class template feature. Priorities, in order:

1. messaging handlers and router behavior
2. storage behavior and reactivity
3. listener lifecycle
4. hooks
5. components

Rules:

- prefer real handlers over mocked wrappers
- prefer `fakeBrowser` over broad module mocks
- avoid mocking whole modules unless unavoidable
- test real storage behavior where possible
- add retry tests for content-tab delivery
- add lifecycle tests for synchronous listener registration
- keep unit and integration tests colocated with the source files they cover
- reserve `tests/` for setup, shared helpers, and any future e2e support

## Folder Layout

```text
.
├── docs/
├── public/
│   └── _locales/
├── src/
│   ├── core/
│   │   ├── browser/
│   │   ├── logging/
│   │   ├── messaging/
│   │   └── storage/
│   ├── entrypoints/
│   │   ├── background/
│   │   ├── content/
│   │   ├── offscreen/
│   │   ├── options/
│   │   └── popup/
│   ├── shared/
│   │   ├── types/
│   │   └── utils/
│   └── ui/
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       └── styles/
└── tests/
    ├── helpers/
    └── setup.ts
```

## Implementation Notes

- Keep comments only where architecture is non-obvious.
- The demo feature is designed to be removable without touching core.
- Prefer entrypoint-first organization; use `shared/` only for genuinely
  cross-context, neutral code.
- Service-worker listeners must be registered synchronously at module load so
  the background script survives reactivation.
