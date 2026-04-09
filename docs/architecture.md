# Architecture

## Final Direction

This template uses a custom messaging system, not WXT messaging.

Reason:

- messaging is the most important reusable part of the template
- this codebase already has strong target-based routing patterns
- custom routing gives us better control over popup/content/background/offscreen flows
- we can improve the current system without carrying over deprecated parts

## Core Rules

- One message has one intended receiver context.
- Background owns workflow orchestration.
- Business-state mutations go through background commands.
- Preferences can be written directly with `wxt/storage`.
- Content owns local DOM interaction logic.
- Popup and options own UI composition state.
- Offscreen is optional and only used for capabilities that need it.

## Messaging

The custom messaging layer should provide:

- typed target maps
- typed message maps per receiver
- typed request/response payloads
- central routing in background
- listener helpers for background/content/offscreen
- automatic response handling from message contract metadata
- optional timeout support
- retry support only for content-tab delivery

The messaging layer should not include:

- deprecated builders
- async message registries
- caller-managed `keepChannelOpen`
- transport-level debouncing

## Storage

Use `wxt/storage` as the default persistence layer.

Write rules:

- preferences/settings: direct writes allowed
- business/workflow state: background only
- ephemeral UI state: Zustand or local component state

IndexedDB should be optional, not part of the base path.

## Demo Extension

The demo extension is `Web Clipper Notes`.

It should cover:

- popup note creation and listing
- selected-text capture from content script
- background orchestration and mutations
- content-side React toast/panel in Shadow DOM
- persisted notes and persisted preferences
- Zustand for local popup state

## Testing

Testing is a core template feature.

Priorities:

1. messaging handlers and router behavior
2. storage behavior and reactivity
3. lifecycle behavior
4. hooks
5. components

Testing rules:

- prefer real handlers over mocked wrappers
- prefer `fakeBrowser` over broad module mocks
- avoid mocking whole modules unless unavoidable
- test real storage behavior where possible
- add retry tests for content-tab delivery
- add lifecycle tests for synchronous listener registration
- keep unit and integration tests close to the source files they cover
- reserve `template/tests/` for setup, shared helpers, and any future e2e support

## Suggested Folder Layout

```text
template/
  docs/
  src/
    core/
      messaging/
      storage/
      browser/
      logging/
    entrypoints/
      background/
      content/
      popup/
      options/
      offscreen/
    ui/
      components/
      hooks/
      stores/
      styles/
    shared/
      types/
      demo-notes.storage.ts
      utils/
  tests/
```

## Implementation Notes

- Keep comments only where architecture is non-obvious.
- Keep the demo removable.
- Keep the template smaller than Webshot but stronger in its foundations.
- Prefer entrypoint-first organization for extension behavior; use `shared/` only for code that is genuinely cross-context and neutral.
