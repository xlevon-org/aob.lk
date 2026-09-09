---
name: unit-tests
description: Write tests for ZOVAX on Node's built-in test runner - happy, boundary and unhappy paths, enumerating combinations rather than picking examples, and every suite proven to fail when the implementation is deliberately broken. Use when adding or changing behaviour, or when existing tests need to be trusted.
---

# Unit Tests

## The setup

**No test framework.** Node's built-in runner:

```
node --experimental-transform-types --test "src/**/*.test.ts"
```

Two constraints that will otherwise waste an hour:

- `--experimental-transform-types` is **required**   the domain uses TypeScript parameter properties, which the plain loader rejects with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`.
- Imports inside `domain/` and `application/` need **explicit `.ts` extensions**, or the runner throws `ERR_MODULE_NOT_FOUND`.

Tests sit beside their code: `Money.ts` / `Money.test.ts`.

## What a complete set covers

Three groups per branch:

**Happy**   the intended path.

**Boundary**   exactly at the limit, and one either side. Every `<` and `<=` in the code needs a test that would fail if it were the other one. The free-delivery threshold, the low-stock threshold, the password minimum, a schedule's start and end.

**Unhappy**   malformed input, empty collections, zero, negative, non-integer, `NaN`, `Infinity`, absent optionals, an original price below the current price, a product id that no longer exists, storage that throws.

## Enumerate, do not sample

Prefer a loop over the matrix to a handful of chosen cases:

```ts
for (const stockQuantity of [0, 1]) {
  for (const isAvailable of [true, false]) {
    for (const publishState of PUBLISH_STATES) {
      // all twelve combinations, named in the test title
    }
  }
}
```

This is how the 36 ordered order-status pairs and the twelve stock × availability × publish-state combinations are covered. A hand-picked case tests what you thought of; the matrix tests what you did not.

Add a test asserting the *shape* of the matrix too   that every status has a transition entry, that no status transitions to itself, that every state is reachable. Those catch a declared-but-unreachable state.

## Prove the test bites

**A test that passes against broken code is worse than no test.** After writing, break the implementation deliberately, confirm the expected tests fail, then revert. State the mutation and the result:

> reverting the schedule end boundary to `>` fails 2 tests; restored, 97 pass

Do not describe a suite as meaningful without this. Applied to the shared contracts, three mutations were tried and each was caught.

## Reporting

Paste the real counts   `ℹ pass 457`   not "all tests pass". Red is red; record it as red.
