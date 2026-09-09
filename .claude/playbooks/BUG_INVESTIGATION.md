# Playbook: Bug Investigation

**Use when** something renders wrong, behaves wrong, or a value on screen disagrees with the data behind it.

**Chain:** `/architecture` (locate) → reproduce → `/unit-tests` (pin) → fix → `/regression` → `/e2e-verify` (if visual or timing-dependent) → `/evaluate`.

**Non-negotiable:** no root cause without evidence   a `file:line`, a measured browser value, or a pasted command output. "Looks correct" is not a diagnosis, and neither is a plausible explanation you did not check.

---

## 1. Scope it before touching code

Get the **observed** value and the **expected** value, both concretely. "The layout is broken" is not reproducible; "at 320px the basket button sits 41px past the viewport edge" is.

Establish:
- Which page, which viewport, which browser state (signed in? cart contents? stored preferences?)
- Does it reproduce on the built bundle (`npm run build && npm run preview`), or only in dev? They differ in class generation and asset paths.
- Is it new? `git log --oneline -20` and, when it matters, `git bisect`.

## 2. Reproduce before theorising

The failure mode of this step is diagnosing from the source and being confident. Several bugs here looked obvious in code and were something else entirely:

- the mobile menu appeared broken; it was `backdrop-filter` creating a containing block
- then it appeared fixed but frozen; the entrance animation was parked at `currentTime: 0`
- the dropdown "was not working"; it was rendering, clipped to 0×0 by an ancestor's `overflow-hidden`

Measure in the browser per `/e2e-verify`. Get the number.

## 3. Find the true cause

Read the code path from the measurement backwards. Do not stop at the first plausible explanation   check it. When a claim can be tested in one line, test it.

Beware of measuring the wrong thing: a selector that matched a different element than intended once produced a whole round of wrong conclusions here. Print what you matched, not just what you computed from it.

## 4. Pin it with a test first

Write a test that **fails now** for the right reason, before fixing. If it cannot be expressed as a test, say why, and lean harder on the browser measurement.

## 5. Fix at the right layer

A presentation symptom often has a domain cause. Fix where the rule belongs, not where it surfaced. If the fix is a workaround, say so plainly and record the real cause in `.claude/memory/gotchas.md`.

## 6. Prove it, and prove it stays fixed

- the pinning test now passes, and still fails when the fix is reverted
- `npm run verify` green at the root
- re-measure the original symptom at the original conditions
- if it is a class of bug rather than one instance, consider a fitness-function rule   and prove that rule catches a deliberate violation

## 7. Report

Symptom, root cause with evidence, fix, proof, and whether anything similar elsewhere is likely. If you were wrong along the way, say so in one line and move on   a corrected diagnosis is worth more than a tidy narrative.
