---
name: design
description: Produce the technical design for a ZOVAX feature from approved requirements - layer placement under the dependency rule, component signatures, data flow, shared contracts, failure modes and requirement traceability - into docs/specs/<feature>/design.md. Use after requirements and before tasks.
---

# Technical Design

Decide *how*. Do not write the implementation.

Output: `docs/specs/<feature-slug>/design.md`, from an approved `requirements.md`.

## 1. Layer placement, justified

For each new piece of behaviour, name its layer and justify it against:

```
domain  <-  application  <-  infrastructure  <-  presentation
```

The test for a domain rule: can it be expressed without `window`, `fetch`, React or a database? If not, it is not a domain rule   say so and place it correctly. `check:arch` will catch a wrong answer, but the design should not need it to.

Common misplacements here: a pricing rule written in a component; a use-case that knows it is talking to MongoDB; a validation rule duplicated in both a form and an entity.

## 2. Component signatures, before any code

Prefer:

- **`Result<T, E>`** over throwing, for failures that are expected business outcomes. A declined payment is not exceptional.
- **Discriminated unions** over boolean flags plus optional fields. `{kind:'Registered', registration}` beats `{ok:true, registration?}`.
- **Value objects** for anything with an invariant   money, serial, slug   so an invalid one cannot be constructed.
- **`readonly` everywhere.** The domain entities are immutable by design; a mutation returns a new value plus a description of what changed.

## 3. Data flow

Trace one complete path through the layers, naming each hop and the port involved. Say which ports are new.

## 4. Shared contracts

Anything crossing between storefront, admin and API goes in `packages/shared`, so all three compile against one definition. A type duplicated in two apps drifts, and the drift only shows when a customer sees the disagreement.

Put the **pure rules** there too, not just the shapes: status transitions, permission resolution, refund arithmetic, discount percentage. Both ends must agree on those.

## 5. What this replaces

If it supersedes a hardcoded constant, name the constant and its file   `packages/shared/src/contracts/content.ts` already maps about twenty of them. If it changes a stored field, say how existing data migrates, or why none exists yet.

## 6. Failure modes

For each new path: absent, empty, slow, unauthorised, already deleted, concurrent. A design that only describes success is not finished.

## 7. Traceability

Map every acceptance criterion to the component satisfying it. An unmapped criterion means the design is incomplete.

## Rules

- **Derive, never store a second copy.** A stored `discountPercentage` sat beside the two prices it is computable from and disagreed with them in 3 of 13 records.
- **No new dependency** without stating why the alternative was worse. Three runtime dependencies and no test framework is deliberate.
- Where a decision is close, record the alternative and why it lost, so a later reader does not re-litigate it. `.claude/memory/decisions.md` is where the durable ones go.
