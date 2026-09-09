---
name: code-quality
description: Review a ZOVAX diff against this codebase's real failure modes - layer direction, a second source of truth, contact details as literals, money as floats, the CSS containing-block traps, runtime-assembled Tailwind classes, lost non-ASCII, and tests that cannot fail. Use before any change is considered done or merge-ready.
---

# Code Review

Read the actual diff, never your memory of what was intended:

```
git diff master...HEAD --stat
git diff master...HEAD
```

`master` is the deploy branch. There is no `main`.

For a large diff, read the `--stat` first and choose an order: contracts and domain before presentation, because an error there is an error everywhere downstream.

## Checklist, ordered by what has actually gone wrong here

**1. Layer direction.** Does any import point outward? `check:arch` enforces it, but read the intent too   a domain file reaching for `window` is a design error even on a passing run.

**2. A second source of truth.** A value derived from others must not also be stored. A hand-maintained `discountPercentage` sat beside the two prices it is computable from and disagreed in 3 of 13 records.

**3. Contact details as literals.** Address, hotline, email and trading role come from `CompanyProfile.ts`. `check:contact` fails the build otherwise.

**4. Money.** Integer cents throughout, including across the wire. No float arithmetic, no `toFixed` for computation, no rounding before the final step.

**5. CSS containing-block and clipping traps**, each of which cost real time:
- `overflow` on a non-positioned element does **not** clip absolutely positioned descendants
- `backdrop-filter` makes an element a containing block for `position: fixed` children
- `overflow-hidden` on a rounded container clips a dropdown to 0×0   in the DOM, invisible, unhittable
- an `em` size resolves against its own parent, not the sibling it should match

**6. Tailwind class strings.** Assembled at runtime from fragments they are never generated into the stylesheet. Complete literal strings only.

**7. String replacements that lost their value.** `className={undefined}` type-checks and renders broken. The pre-write hook blocks the obvious form; read for the rest.

**8. Lost non-ASCII.** A scripted edit silently stripped em dashes from the page `<title>` and twelve README headings. Scan for non-ASCII present on removed lines and absent on added ones.

**9. Tests that cannot fail.** Assertions holding whether or not the change is correct. Check by mutating, not by reading.

**10. Comments.** Do they explain *why*, and are they still true after this diff? A comment describing the old behaviour is worse than none.

## By file type

- **`packages/shared/**`**   three apps compile against this. Is anything optional that should be required? Are the pure rules shared rather than duplicated?
- **`domain/**`**   no platform globals; invariants enforced in the constructor; `Result` for expected failures; immutable.
- **`application/**`**   depends on ports, never adapters.
- **`infrastructure/**`**   implements its port exactly; honest about what a real implementation will need.
- **`presentation/**`**   keyboard reachable; dialogs dismissible by button, Escape and outside press.
- **`scripts/*.mjs`**   a fitness function never seen to fail is not known to work.

## Report

Findings most-severe first, each with `file:line`, the concrete failure it causes, and a fix. Separate **blocking** from **worth considering**.

Say plainly when a diff is clean. A review that always finds something teaches people to ignore it.
