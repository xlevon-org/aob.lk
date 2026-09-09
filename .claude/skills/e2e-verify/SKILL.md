---
name: e2e-verify
description: Prove a ZOVAX behaviour in a real browser with measured values rather than screenshots - hit-testing controls, detecting horizontal scroll correctly, checking for clipping, and verifying the built bundle rather than the dev server. Use whenever a change is user-visible, or when a claim about rendering needs evidence.
---

# End-to-End Verification

The house method. A screenshot shows that something rendered. It does not prove a control is reachable, a menu is unclipped, or a layout does not overflow. **Measure, then look.**

## 1. Serve the built bundle

```
npm run build && npm run preview     # http://localhost:4173
```

Verify the built output, not the dev server. They differ in class generation, asset paths and minification   exactly the ways that bite.

## 2. State the expected value BEFORE measuring

Name the number you expect: *"the menu should be 288px wide, inside the viewport, hit-testable at its centre"*. Then measure.

Deciding what counts as correct after seeing the result is how a bug gets rationalised into a feature.

## 3. Measure inside the page

Use same-origin iframes of a known width rather than resizing the window. `resize_window` has repeatedly reported success here while `innerWidth` stayed unchanged, and the real window has reported 0×0.

```js
const f = document.createElement('iframe');
f.style.cssText = 'position:fixed;left:-99999px;top:0;width:375px;height:900px;border:0';
f.src = '/';
document.body.appendChild(f);
await new Promise(r => { f.onload = r; setTimeout(r, 8000); });
```

Each of these has hidden a real defect in this repository:

| Question | How to answer it |
|---|---|
| Does the page scroll sideways? | `win.scrollTo(4000,0)` then read `scrollX`. **Not** `scrollWidth`   it missed 1229px of overflow |
| Is this control actually clickable? | `document.elementFromPoint(cx, cy)`, then check the element contains the result |
| Is a menu clipped? | its `getBoundingClientRect()`, plus every ancestor's computed `overflow` |
| Did the animation finish? | `getAnimations()`   `playState` and `currentTime`. One was parked at 0 |
| Is the image real? | `naturalWidth > 0`. `complete` is `true` for a 404 |
| How many grid columns? | `getComputedStyle(grid).gridTemplateColumns`, count the tracks |
| Where is the breakpoint? | measure at the boundary and one pixel either side |

**Verify you measured the element you meant.** A selector that matched a different grid on the page once produced an entire round of wrong conclusions. Print what you matched, not only what you computed from it.

**Long synchronous loops freeze the renderer** and every subsequent tool call times out. Assign the result to `window.__X` from an async IIFE and poll for it.

## 4. Report

Paste the measured values at every width tested, as a table. If something could not be observed, say so and say why   never infer it from reading the code.
