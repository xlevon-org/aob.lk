---
name: qa
description: Full quality sweep of a ZOVAX change - scenario matrix, tests audited by mutation, adversarial input, diff review, full regression, browser proof at every width, ending in a GO or NO-GO verdict. Use before merging anything non-trivial, or when asked to prove a change is safe.
---

# Quality Assurance

Prove the change is correct across all paths, or block it. **"Looks fine" is not a verdict.**

## 1. Scope

Identify the diff (`git diff master...HEAD`, or the working tree) and the layers it touches. Build the scenario matrix. A row with no coverage needs a written waiver, not silence.

## 2. Review and harden

- Review the diff against this codebase's real failure modes - findings most-severe first with `file:line`.
- Attack every input surface the change touches.
- **Audit the existing tests** for the touched code: would they fail if the change regressed? Prove it by mutating the implementation, not by reading them.

Write tests for any branch the matrix shows uncovered.

## 3. Regression

```
npm run verify
npm run build
```

Paste the real counts. Red blocks everything downstream.

## 4. Browser verification

On the built bundle served by `npm run preview`. **Name the expected value before measuring.** Cover the unhappy paths, not just the one that works:

- empty cart, single item, quantity above stock
- out-of-stock and unpublished products
- every dialog opened and dismissed by each of its routes
- every width, including the exact breakpoint boundary
- storage unavailable, and an image that 404s

State explicitly which scenarios remain unobserved and why.

## 5. Decide

Merge every finding, fix the blocking ones, re-run the affected checks, and add a regression test for each injection FAIL. Then give a verdict.

## Blocking conditions

**NO-GO on any single one**, regardless of the rest:

- a failing acceptance criterion
- a red gate in `npm run verify`
- a behavioural claim never verified
- horizontal scroll at any tested viewport
- a control that renders but cannot be operated
- money, stock or an order in a state the domain says is impossible

Every PASS names its evidence. Give the verdict in the final message.
