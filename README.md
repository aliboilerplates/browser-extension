# WXT Browser Extension Template

Production-focused browser extension template distilled from the strongest architecture patterns in the original Webshot codebase.

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

## Current State

The template already includes:

- explicit-import WXT config
- popup, options, background, content, and offscreen scaffolding
- custom messaging core with typed contracts, runtime routing, timeout support, and retriable content delivery
- shared persistence, theme, logging, and browser capability helpers
- a lightweight `Web Clipper Notes` demo spanning popup, background, and content
- colocated tests around messaging, storage, hooks, browser helpers, handlers, and popup UI

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
- context-first source organization for extension behavior

## Remaining Work

1. Keep tightening docs and code comments where architecture is non-obvious
2. Expand verification around listener lifecycle and content delivery edge cases
3. Polish the demo so it stays useful but easy to delete
4. Continue hardening the standalone template for reuse across new extensions
