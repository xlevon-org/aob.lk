---
name: test-plan
description: Build the scenario matrix for a ZOVAX change, or audit an existing suite's quality by mutating the implementation to see whether the tests notice. Use before writing tests, or when existing tests need to be trusted rather than assumed.
---

# Test Planning

## scope <feature>

Enumerate combinations rather than listing examples. Dimensions that matter here:

**Catalogue** - empty / one / many; discounted / not / original below price; stock 0 / 1 / at threshold / above; each publish state; a product referencing a deleted brand.

**Cart and orders** - empty; single line; quantity above stock; subtotal exactly at the free-delivery threshold and one cent either side; every payment method; every ordered pair of order statuses; a refund at, below and above the total.

**Identity** - guest; signed in; expired session; locked account; unverified email; OTP replayed, expired, or one attempt past the lockout.

**Viewport** - 320, 375, 414, 640, 768, 1024, 1280, 1440, 1920, and the exact boundary of any breakpoint touched.

**Interaction** - mouse, keyboard, touch; every dialog dismissed by each of its routes (button, Escape, outside press).

**Environment** - storage unavailable; image 404; API unreachable or slow; maintenance mode.

For each row: the level it is tested at (unit / integration / browser) and the command or measurement that proves it. A row with no coverage needs a written waiver.

## evaluate <suite>

Judge the tests, not the code:

- **Would each test fail if its behaviour regressed?** Check by mutating the implementation, not by reading the assertions. This is the only reliable signal.
- Is every `<` / `<=` boundary pinned on both sides?
- Are unhappy paths present, or only success?
- Does any test assert on something it did not actually exercise?
- Does the suite assert its own shape - that every enum member has a case, that the expectation table matches the data size? Those catch drift a per-case test cannot.

Report per file: test count, boundaries covered, mutation-resistance, and the specific gaps.
