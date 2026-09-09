---
name: smoke-test
description: Fast health check of the ZOVAX storefront - build, serve, and confirm the key pages render without errors, broken images or horizontal scroll. Use after any change that could affect the whole site, and as a first check before deeper verification.
---

# Smoke Test

A few minutes. Run after any change that could affect the whole site. Not a substitute for regression or full browser verification.

## 1. Build

```
npm run build
```

Must succeed and emit, at the **repository root**: `dist/index.html`, `dist/assets/`, `dist/logo/`, `dist/products/`.

If the asset hashes are unchanged from the previous build, say so - it means the bundle did not actually change, which is proof for a no-op refactor and a warning otherwise.

## 2. Serve

```
npm run preview      # http://localhost:4173
```

Confirm HTTP 200 before going further.

## 3. Render check

For the home page, catalogue, a product page, cart and checkout:

- renders without hitting the error boundary
- no broken images: `[...document.images].filter(i => i.complete && i.naturalWidth === 0)` is empty
- no console errors
- no horizontal scroll: `win.scrollTo(4000,0)` then `scrollX === 0`

## 4. Report

Paste the build output, the HTTP status and the per-page results. "Looks fine" is not a result.
