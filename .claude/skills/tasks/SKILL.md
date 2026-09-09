---
name: tasks
description: Break an approved ZOVAX design into a numbered, dependency-ordered implementation checklist where every task names its files and one command that proves it, plus an acceptance-criteria coverage table. Use after design and before implementation.
---

# Task Breakdown

Output: `docs/specs/<feature-slug>/tasks.md`, from an approved `design.md`.

## The shape of a task

```
### T3. Reference brand by id on Product
Files:   apps/web/src/domain/catalog/Product.ts
         apps/web/src/infrastructure/catalog/ProductMapper.ts
Depends: T1, T2
Verify:  npm run verify --workspace @zovax/web
Done:    [ ]
```

Every task carries a number, its files, its dependencies, **one command that proves it**, and a checkbox.

A task whose completion cannot be checked by running something is too vague. Split it until it can.

## Ordering

Innermost first, because outer layers depend on inner ones:

```
packages/shared  ->  domain  ->  application  ->  infrastructure  ->  presentation
```

Within a layer, order by dependency. **Two tasks touching the same file are never independent.**

## Size

Small enough that a failing Verify points at one cause.

- Too big: "Build the admin portal"
- Right: "Add the product list route with its loading, empty and error states"

## The tail

Every list ends with:

- a regression task   `npm run verify` at the root, full counts pasted
- a browser verification task for anything user-visible, naming the widths
- an evaluation task   the `evaluate` skill, against each acceptance criterion

## Coverage table

Close with a table mapping each acceptance criterion to the tasks satisfying it.

| AC | Tasks |
|---|---|
| AC-1 | T2, T5 |
| AC-2 | T7 |

An unmapped criterion means the breakdown is incomplete. A task mapping to nothing is out of scope   justify it or drop it.

## Rules

- Work top to bottom. `[x]` only on a green Verify with **pasted output**.
- On red, stop and fix at the layer that caused it. Never push forward intending to come back.
- If scope changes mid-build, return to requirements and regenerate the affected tasks rather than letting code drift ahead of the spec.
