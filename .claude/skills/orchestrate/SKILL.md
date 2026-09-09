---
name: orchestrate
description: Top-level workflow for ZOVAX - route any non-trivial request through the gated pipeline (requirements, design, tasks, implement, test, harden, review, regression, browser verification, evaluate) in the right order, enforcing the gate between each phase so nothing is skipped. Use for any request large enough that skipping a phase would be tempting.
---

# Orchestrator

Route the request through the pipeline and enforce the gates. The point is that no phase gets skipped because the next one looked more interesting.

## The pipeline

```
requirements -> design -> tasks -> implement
             -> unit-tests -> injection-test
             -> code-quality -> regression
             -> e2e-verify / responsive -> evaluate
             -> (with explicit approval) deploy
```

Use `architecture` at any point to understand before changing. Use `progress` to record evidence as you go.

## The gates

Each is a real stop, not a formality:

| Between | Gate |
|---|---|
| requirements → design | assumptions stated and verified; open questions **asked**, not assumed |
| design → tasks | every acceptance criterion maps to a component |
| tasks → implement | every task has one command that proves it |
| implement → test | each task's Verify pasted green |
| test → review | every new branch covered; the suite **proven to fail** when mutated |
| review → regression | blocking findings fixed |
| regression → evaluate | `npm run verify` green at the root, counts pasted |
| evaluate → deploy | GO **and** explicit user approval |

## Sizing the route

Not everything needs all of it. Judge honestly rather than ceremonially:

- **A copy or content change**   implement, `check:contact`, regression, browser check. No spec.
- **A layout change**   implement, `responsive` at every width, regression, browser proof.
- **A defect**   the bug-investigation playbook: reproduce, pin with a failing test, fix, prove.
- **A new capability**   the full pipeline.
- **Anything touching money, stock, orders or auth**   the full pipeline, no exceptions, plus `injection-test`.

Skipping a phase is a decision. State it and why. Skipping it silently is not.

## Standing constraints

These hold for every request in this repository:

1. **State assumptions before acting**, and verify them.
2. **Never claim correctness that was not verified.** Paste the evidence.
3. **Never handle only the happy path.** Enumerate the combinations.
4. **Say under what conditions it works**   and where it was not verified.

## Reporting

At the end: what changed, which phases ran, the evidence for each, what remains unverified, and the verdict. If a phase was skipped, say which and why.
