# Key Concepts

Topics introduced by this task. Understand these before reviewing the implementation.

## Custom Extension Messaging

An internal transport layer for popup, background, content, and optional offscreen contexts that is designed around the extension’s actual workflow needs rather than a generic wrapper.

**In this task:** The template’s main architectural advantage is a custom typed messaging system with explicit receiver ownership, background routing, content-tab retry behavior, and testable listener boundaries.

## Service Worker Listener Registration

Manifest V3 background scripts are service workers, which means they can stop and restart at any time. Any runtime listeners needed for correct behavior must be registered synchronously when the worker starts.

**In this task:** The template must register background listeners synchronously and include lifecycle tests so the transport layer remains reliable after worker restarts.

## Shadow DOM Content UI

A Shadow DOM root lets an extension inject UI into arbitrary webpages while isolating styles and reducing conflicts with page CSS.

**In this task:** The template uses a React content UI mounted through WXT’s Shadow DOM helper so new extensions can build page overlays and toasts safely.

## WXT Testing with Fake Browser

WXT provides testing utilities like `WxtVitest()` and `fakeBrowser` so extension logic can be tested against realistic browser API behavior without broad mocks.

**In this task:** The template’s tests should prefer real handlers, real storage behavior, and WXT testing primitives instead of mocking entire modules.
