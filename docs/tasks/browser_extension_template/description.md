# Browser Extension Template

## Overview

Create a production-grade browser extension template based on the strongest architecture patterns from the original Webshot codebase. The template should make it easy to start new WXT extensions without rebuilding messaging, storage, testing, content UI, and project structure from scratch. It should include a lightweight demo extension that proves the patterns with real code and tests.

## Requirements

- Use WXT with explicit imports only; do not use WXT auto-imports.
- Use a custom typed messaging system inspired by the current codebase, not `@webext-core/messaging`.
- Keep background as the owner of workflow orchestration and business-state mutations.
- Support popup, background, content, and optional offscreen contexts in the architecture.
- Include a lightweight demo extension (`Web Clipper Notes`) that exercises popup, background, content, React UI, Zustand, `wxt/storage`, and Shadow DOM content UI.
- Include offscreen scaffolding and documentation only in v1; do not build a real offscreen demo flow yet.
- Provide strong test coverage for messaging, storage, lifecycle, hooks, and key UI flows with minimal mocking.
- Keep unit and integration tests close to the source files they cover; use `tests/` only for shared setup/helpers and future e2e support.
- Add clear documentation and targeted comments for non-obvious architecture.
- Keep the template smaller than Webshot while improving its foundations and testability.
- Prefer context-first organization for template code; do not force a top-level `features/` layer in v1.

## Non-Goals

- Building a full-featured product demo with auth, sync, or remote APIs.
- Including advanced media, recording, or canvas workflows in v1.
- Adding CI/CD, publishing automation, or monorepo tooling in v1.
- Adding runtime schema validation across all messaging by default.

## Research

- **Decision**: Keep the template as a standalone repository root — extraction has already happened, so the docs should describe the repo as the template itself rather than a nested future artifact.
- **Decision**: Keep a custom messaging system — the current codebase already demonstrates strong extension-specific messaging patterns: typed target maps, context-level listener filtering, central background routing, and retriable content delivery. With deprecated builder logic removed, custom messaging is now a better fit for the template’s goals than a generic wrapper.
- **Decision**: Remove deprecated messaging ideas from the template — `messageBuilder.ts` is gone and `ASYNC_MESSAGES` is no longer part of the active transport design, so the template should not carry either concept forward.
- **Decision**: Keep explicit imports — WXT auto-imports add ambiguity and reduce readability in a reusable template.
- **Decision**: Keep a custom project structure instead of WXT’s flatter default — `core/`, `entrypoints/`, `ui/`, and `shared/` better teach architecture and ownership boundaries than generic `components/` and `utils/` folders alone.
- **Decision**: Prefer entrypoint-first organization in v1 — popup, background, and content behavior should live near the context that owns it; only genuinely neutral cross-context code belongs in `shared/`.
- **Decision**: Use `wxt/storage` for persistence — it is the right default for settings and lightweight shared state; IndexedDB should remain optional advanced infrastructure.
- **Decision**: Retry logic belongs only to content-targeted tab messaging — content scripts can be late to load or briefly unavailable; blanket retries across all runtime messaging would hide failures and complicate transport behavior.
- **Decision**: Add optional timeout support to messaging — timeouts are useful for long-running background or offscreen work, while cancellation and debouncing should stay at the feature layer, not the transport layer.
- **Decision**: Include a lightweight demo extension inside the template — a removable demo teaches usage better than an empty skeleton or a separate branch.
- **Decision**: Use offscreen as optional scaffolding only in v1 — this preserves the architectural slot without overloading the first version.
- **Decision**: Make testing a primary design constraint — use `WxtVitest()` and `fakeBrowser`, prefer real handlers and real storage behavior, and avoid broad module mocks unless there is no cleaner seam.

Platform and framework constraints confirmed during research:

- Extension service-worker listeners must be registered synchronously for reliable reactivation.
- `runtime.sendMessage` is for one-off async cross-context messaging.
- `tabs.sendMessage` is the right delivery path for content scripts.
- Offscreen documents use runtime messaging and should be treated as optional specialized contexts.
- WXT entrypoints and content-script Shadow DOM helpers remain the right foundation for background/content/popup organization.

## Edge Cases

- **Scenario**: A content script is not ready when the background sends a message → **Expected**: content-targeted send helpers retry a small number of times, then fail with a clear transport error.
- **Scenario**: A popup tries to mutate business data directly through storage → **Expected**: template architecture and demo flows route those mutations through background commands instead.
- **Scenario**: Service worker restarts during extension usage → **Expected**: listeners are re-registered synchronously at startup and workflow-safe state is recoverable from storage.
- **Scenario**: A developer removes the demo feature → **Expected**: the core template infrastructure remains intact and the demo can be deleted cleanly with minimal coupling.
- **Scenario**: Firefox build excludes offscreen support → **Expected**: offscreen remains optional scaffolding and browser capability checks/documentation make the omission explicit.

## Open Questions

- Should v1 include a side-panel optional module or leave that for a later iteration?
- Should a basic GitHub Actions workflow be added after the template core is stable?
- Should publishing scaffolding (`wxt submit`) be documented later rather than included immediately?

## Test Strategy

- Unit-test the custom messaging layer heavily:
  - message contract typing helpers
  - listener filtering and routing
  - response behavior
  - timeout behavior
  - content retry behavior
- Test `wxt/storage` usage with `fakeBrowser` rather than mocking storage modules.
- Add lifecycle tests for synchronous background registration and content mount/unmount cleanup.
- Test `useStorageItem` and any message hooks with real storage/message seams where possible.
- Add popup component tests for note creation, filtering, and persisted state rendering.
- Add content UI tests for the Shadow DOM-mounted note/selection feedback UI.
- Avoid mocking whole modules unless the dependency is an unavoidable hard boundary.

## Acceptance Criteria

- [ ] The repository root contains the agreed WXT project structure with explicit imports and core architecture docs.
- [ ] The template includes a custom typed messaging system that replaces deprecated patterns from the source codebase.
- [ ] The template includes a lightweight `Web Clipper Notes` demo that exercises popup, background, content, React, Zustand, `wxt/storage`, and Shadow DOM content UI.
- [ ] Offscreen exists as documented optional scaffolding only, with no real demo flow in v1.
- [ ] The template is documented well enough that a new chat/session can continue implementation without relying on conversation history.
- [ ] Messaging, storage, lifecycle, hooks, and key UI flows have strong tests built with WXT testing primitives and minimal mocking.
