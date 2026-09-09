# Gotchas

Traps already paid for once, each with the measurement that revealed it. These are not theory   every one cost real time in this repository.

## Layout and CSS

**G1   `overflow` does not clip absolutely positioned descendants of a non-positioned element.**
A descendant's containing block is its nearest *positioned* ancestor, or the initial containing block when there is none. Tailwind's `.sr-only` is `position: absolute`, so an sr-only rating label inside an unanchored carousel escaped the track and laid out at x=1542, extending the document to 1542px while `body.scrollWidth` still read 313.
*Measured:* 1229px of sideways scroll at a 320px viewport, over entirely blank space.
*Fix:* every horizontal track is `relative`. Enforced by `check-responsive.mjs`.

**G2   `documentElement.scrollWidth` is not how you detect horizontal scroll.**
It missed G1 completely. Use `win.scrollTo(4000, 0)` and read `scrollX`.

**G3   `overflow-hidden` on a rounded container clips a dropdown to 0×0.**
The header search form sets it to clip its own corners. The menu was present in the DOM, invisible, and unhittable.
*Measured:* `listRect = {y:0, w:0, h:0}`, `optionHittable: false`.
*Fix:* `Select` portals its menu into `document.body` and positions it in viewport coordinates.

**G4   `backdrop-filter` makes an element a containing block for `position: fixed` descendants.**
The mobile menu measured 150px wide inside a blurred parent instead of 904px.
*Fix:* portal it.

**G5   an `em` size resolves against its own parent, not the sibling it should match.**
`.LK` at `text-[0.7em]` sat at 11.2px against a 20px wordmark   a ratio of 0.560 where the footer's was 0.700.
*Fix:* size explicitly per breakpoint.

**G6   Tailwind class strings must be complete literals.**
Tailwind scans source text. A string assembled at runtime from fragments is never generated into the stylesheet. See `apps/web/src/presentation/format/layout.ts`.

## Tooling and environment

**G7   `convert` on this machine is `C:\WINDOWS\system32\convert`,** the FAT-to-NTFS utility, not ImageMagick. Running it on an image would attempt a filesystem conversion. Image work is done with a small PNG decoder on `node:zlib`.

**G8   the browser extension's `resize_window` is unreliable.** It has reported success while `innerWidth` stayed unchanged, and the real window has reported 0×0. Measure inside same-origin iframes of a known width instead.

**G9   long synchronous loops in the page freeze the renderer** and every subsequent tool call times out. Assign results to `window.__X` from an async IIFE and poll.

**G10   verify the element you measured is the one you meant.**
A `footer .grid` selector matched the guarantees strip rather than the address columns, and an entire round of column-width conclusions was wrong as a result.

**G11   heredocs and Python `-c` mangle escapes.**
`\n` inside a heredoc became a real newline and broke a test file; a `\b` regex became a literal backspace character and silently disabled an audit rule. Prefer the Write tool for anything containing escapes, and re-read what landed.

**G12   scripted edits can silently strip non-ASCII.**
Em dashes were removed from the page `<title>`, twelve README headings and a `Product.ts` alt-text string by an edit that touched none of them deliberately. Scan diffs for non-ASCII on removed lines that is absent on added ones.

**G13   `grep -c '\r'` counts every line.** An empty pattern matches everything; it produced a false CRLF diagnosis. Use `od`/`hexdump` to inspect line endings.

## Testing

**G14   Node's test runner needs `--experimental-transform-types`** for the TypeScript parameter properties the domain uses, and imports inside `domain/` and `application/` need explicit `.ts` extensions or it throws `ERR_MODULE_NOT_FOUND`.

**G15   a test suite is not trustworthy until it has been seen to fail.**
Mutate the implementation, confirm the expected tests go red, revert. Applied to the shared contracts: making `refunded` non-terminal failed 2, removing the permission-denial rule failed 3, making a schedule end inclusive failed 2.

**G16   type-checking was vacuous until `@types/react` was installed.**
`tsc --noEmit` passed while real defects existed. Installing the types surfaced four.

## MongoDB and Mongoose

**G17   `sparse: true` does not exclude a field that is present-but-`null` - only a field that is entirely absent.**
A `unique: true, sparse: true` index on `Product.legacySeedId` (schema default `null`) still indexed every non-migrated product's `legacySeedId: null`, because Mongoose's own `default: null` WRITES the field into every document rather than omitting it - so every second product hit a genuine `E11000 duplicate key` on `{legacySeedId: null}`.
*Fix:* a partial index instead - `{ unique: true, partialFilterExpression: { legacySeedId: { $type: 'string' } } }` - which only indexes a document whose field is actually a string, so `null` never collides with `null` regardless of how many documents carry it.

**G18   changing an index's definition in a schema file does not change it on an already-populated collection.**
Mongoose's `autoIndex` (on by default) calls `ensureIndexes` on connection, which SKIPS an index that already exists under the same NAME - even when its options (e.g. `sparse` vs `partialFilterExpression`) have changed. After fixing G17 in the schema file, the exact same duplicate-key failures kept happening; the live index on the actual collection was still the stale `sparse: true` version. *Confirmed* by connecting directly and reading `collection.indexes()` - the stale definition was still there, unchanged, across three different databases the various test files had already populated.
*Fix:* `collection.dropIndex('<name>')` once per already-populated collection/database, then let the next connection recreate it correctly. There is no way to make Mongoose do this automatically short of calling `Model.syncIndexes()` explicitly (which also DROPS any index no longer in the schema - not used here, since other indexes were fine). Worth checking `collection.indexes()` directly (not just the schema file) whenever an index-related test failure doesn't match the code being read.
