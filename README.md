# WXT Browser Extension Template

Production-focused browser extension template built from the strongest patterns in this codebase.

## Goals

- Start new WXT extensions without rebuilding infrastructure each time
- Keep messaging as a first-class architecture concern
- Ship with strong testing from day one
- Support popup, background, content, and optional offscreen contexts cleanly

## Architecture Summary

- Custom typed messaging system
- Background owns workflow orchestration and business-state mutations
- Popup and options own UI composition
- Content owns DOM-local interaction flows
- `wxt/storage` for persistent state
- React + Zustand for UI
- Shadow DOM content UI
- Vitest + WXT testing + minimal mocking
- Colocated unit/integration tests next to source files

## Demo Extension

The template includes a lightweight demo extension: `Web Clipper Notes`.

It exists to prove the template patterns with real code and tests:

- save notes from popup
- save selected text from content script
- show content-side React UI in a Shadow DOM
- persist notes and preferences
- exercise popup, background, content, storage, messaging, Zustand, and UI components

The demo should be easy to remove after project creation.

## What This Template Optimizes For

- serious multi-context extensions
- maintainable custom messaging
- clear ownership rules
- realistic testing
- clean extraction into a separate repo later
- context-first source organization for extension behavior

## Next Build Phases

1. Implement messaging core
2. Implement storage/theme/logging utilities
3. Add entrypoints and content UI shell
4. Build the demo extension
5. Add tests across transport, storage, and UI
