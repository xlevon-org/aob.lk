---
name: responsive
description: Verify ZOVAX layout across the full width range - horizontal overflow detected correctly, grid column counts read from computed style, controls hit-tested, breakpoints checked at the exact boundary. Use whenever layout changes, a grid or breakpoint is touched, or something "looks wrong" on a phone.
---

# Responsive Verification

Layout defects here have been subtle and repeatedly invisible to inspection. Measure rather than look.

## Widths

320, 375, 414, 639, 640, 768, 1024, 1280, 1440, 1920   plus the **exact boundary** of any breakpoint the change touches.

A breakpoint verified *near* is not verified. The bug is usually one pixel to one side.

## Per width, record

**1. Horizontal scroll.** `win.scrollTo(4000, 0)` then read `scrollX`. Must be 0.

`documentElement.scrollWidth` alone is not sufficient, and this is the trap that cost the most time here. `overflow` on a **non-positioned** element does not clip an absolutely positioned descendant, because that descendant's containing block is its nearest *positioned* ancestor   the initial containing block when there is none. Tailwind's `.sr-only` is `position: absolute`, so an sr-only label inside an unanchored carousel escaped the track, laid out at x=1542, and extended the document while `body.scrollWidth` still read 313. That was 1229px of sideways scroll over blank space, at a 320px viewport.

**2. Column counts.** Read `getComputedStyle(grid).gridTemplateColumns` and count tracks. Never infer from class names   and confirm the element you matched is the one you meant.

**3. Reachability.** For every interactive element, `elementFromPoint` at its centre must land inside it. A control can render perfectly and be covered by an overlay. The chat launcher was invisible under a cookie banner this way.

**4. Container overflow.** `el.scrollWidth > el.clientWidth` for headers, toolbars and any flex row with a fixed-width sibling.

**5. Text.** No unintended wrap. Compare rendered height against `lineHeight` to count lines, rather than judging from a screenshot.

## The static gate

```
npm run check:responsive --workspace @zovax/web
```

Enforces six rules. Note that it prints only four summary lines on success   two rules are silent unless they fire, so read the source rather than the summary if you need the full set:

| Rule | Catches |
|---|---|
| `fixed-width-overflow` | a fixed width above 288px of usable space at 320px |
| `grid-no-mobile-base` | a multi-column grid with no mobile base |
| `visible-scrollbar` | `overflow-x-auto` without `no-scrollbar` |
| `unanchored-scroll-track` | a horizontal scroller that is not a positioning context   the rule that prevents the overflow above |
| `nowrap-in-flex` | `whitespace-nowrap` on a `flex-1` element with no `truncate` or `min-w-0` |
| `small-tap-target` | a button under 36px tall |

If you add a rule, **prove it catches a real violation**: introduce one, watch it fail, revert, watch it pass. A rule never seen to fail is not known to work.

## Report

A table of width against measurement:

```
 320px  cols=1  card=231x434  hscroll=0
 640px  cols=2  card=256x462  hscroll=0
```

Not "responsive is fine".
