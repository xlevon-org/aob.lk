---
name: evaluate
description: Final decision gate for a ZOVAX change - assess the completed work against every acceptance criterion with named evidence, report matrix coverage and gate status, and return a GO or NO-GO verdict. Use as the last step before declaring work done or merging, after implementation, regression and browser verification.
---

# Evaluate   the decision gate

Reach a verdict. Do not describe the work.

## 1. Per-criterion table

| AC | Statement | Verdict | Evidence |
|---|---|---|---|
| AC-1 | free delivery at exactly LKR 50,000 | PASS | `ShippingPolicy.test.ts` boundary case, `ℹ pass 457` |
| AC-2 | one card per row below 640px | PASS | measured `gridTemplateColumns` = 1 track at 320/375/414/639 |

Every PASS names a concrete artifact   a test name, a pasted line, a measured value. **"Implemented" is not evidence, and neither is "verified" without the value that was seen.**

## 2. Then report

- **Scenario matrix**: covered n/m. Each uncovered row gets a written waiver or a FAIL.
- **`npm run verify`**: pasted counts for every workspace.
- **Build**: succeeded, and whether the emitted asset hashes changed.
- **Unobserved**: anything that could not be verified, and why. This is not a footnote   an unverified claim is the failure mode this gate exists to catch.

## 3. Verdict

**NO-GO on any single one of these**, regardless of the rest:

- a failing acceptance criterion
- a red gate in `npm run verify`
- a behavioural claim that was never verified
- horizontal scroll at any tested viewport
- a control that renders but cannot be operated   measured by hit-testing, not eyeballed
- money, stock or an order in a state the domain says is impossible
- a leaked stack trace or a 500 where a 4xx belongs

Say **GO** or **NO-GO** plainly in the final message. **A hedge is a NO-GO.**

## 4. If NO-GO

Name exactly what blocks it and what would clear it. A verdict without a route forward is half an answer.

Partial completion is reported honestly: "done except X, because Y" is useful. "Done" that is not, is not.
