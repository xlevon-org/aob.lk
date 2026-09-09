# Playbook: Feature Implementation

**Use when** building something new   a product capability, an admin screen, an API resource, a storefront section.

**The chain:** `/requirements` → `/design` → `/tasks` → implement → `/unit-tests` → `/injection-test` → `/code-quality` → `/regression` → `/e2e-verify` → `/evaluate` → (with approval) `/deploy`.

For anything non-trivial, start with `/develop`, which runs this chain. This playbook says what "done right" looks like at each phase **for this codebase specifically**.

---

## 1. Requirements (`/requirements`)

Produces `docs/specs/<slug>/requirements.md`. For this project, make sure it captures:

- **What is currently hardcoded** that the feature needs to be dynamic. This repository is full of constants that look like data   the product taxonomy is a TypeScript union type, and roughly twenty pieces of site content are module-level constants.
- **The scenario matrix**, including empty and boundary states: an empty catalogue, a product with no discount, stock at exactly the low-stock threshold, a subtotal exactly at the free-delivery threshold.
- **Every viewport** the feature appears at, and the exact breakpoint boundaries.
- **Acceptance criteria in EARS form**, each naming how it will be proved.

## 2. Design (`/design`)

Produces `design.md`. Decide layer placement first, and be honest about it: a rule that needs `window` or `fetch` is not a domain rule.

Prefer:
- `Result<T, E>` over throwing for expected business failures
- discriminated unions over boolean flags
- value objects for anything with an invariant
- deriving over storing   a stored copy of a computable value has already drifted here

Anything crossing between storefront, admin and API belongs in `packages/shared`.

## 3. Tasks (`/tasks`)

Produces `tasks.md`. Each task names its files, its dependencies and **one command that proves it**. Ordered innermost-first: `shared → domain → application → infrastructure → presentation`.

## 4. Implement

Top to bottom. After each task run its Verify and paste the real output into `tracking.md`. `[x]` only on green; on red, stop and fix at the causing layer.

Watch for the traps in `.claude/memory/gotchas.md`   particularly Tailwind class strings (must be complete literals), portalling anything that could be clipped, and integer cents for money.

## 5. Test (`/unit-tests`)

Happy, boundary and unhappy for every branch. Enumerate combinations rather than picking examples   the twelve stock × availability × publish-state combinations, all 36 ordered order-status pairs.

**Then prove the tests bite.** Mutate the implementation, confirm the expected failures, revert. A suite never seen to fail is not known to work.

## 6. Harden (`/injection-test`)

Attack every input surface the feature touches. Each FAIL gets a regression test written before the fix.

## 7. Review and verify

`/code-quality` on the diff, `npm run verify` at the root, and `/e2e-verify` in a real browser for anything visible   measuring, not eyeballing, at the widths in `/responsive`.

## 8. Evaluate (`/evaluate`)

Per-criterion PASS/FAIL with named evidence, and a GO or NO-GO. A hedge is a NO-GO.

## 9. Ship

Only via `/deploy`, only with approval, and only after re-verifying the merged tree. See `DEPLOYMENT_SAFETY.md`.

---

## What "done" means here

Not "the code is written". Done is: every acceptance criterion proved with named evidence, the full suite green with pasted counts, the change measured in a real browser at every relevant width, gaps stated explicitly, and nothing claimed that was not verified.
