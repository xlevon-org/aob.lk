---
name: requirements
description: Turn a raw request for the ZOVAX storefront, admin portal or API into verified, testable requirements - assumptions with evidence, a full scenario matrix rather than a happy path, and EARS acceptance criteria each naming how it will be proved. Use BEFORE any design or implementation when a request is new, ambiguous, or multi-part.
---

# Requirements

Turn a request into requirements that can be checked. **Never proceed to design or code from an unanalysed request.**

Output: `docs/specs/<feature-slug>/requirements.md`.

## 1. Restate and check against reality

Restate the request in one paragraph in your own words, then classify it: new capability / behaviour change / defect / verification / content-only.

Check it against the code. Does the described behaviour already exist, partly exist, or contradict what is there? Cite `file:line`. If it conflicts with something already verified, surface the conflict   do not silently pick a side.

## 2. State assumptions before anything else

List each as `A1, A2, …` with **how it was verified** or **why it needs confirmation**:

```
A1  Prices are LKR and stored as integer cents.  [verified: domain/shared/Money.ts:11]
A2  The admin will manage brands as records.     [unverified - changes the schema; ask]
```

An unverified assumption that changes the work is a question for the user, not a guess.

## 3. Enumerate scenarios across every dimension

Not a list of examples   a matrix. For this project the dimensions that matter:

- **Catalogue**: empty / one product / many; discounted / not / original below price; stock 0 / 1 / at the low-stock threshold / above; each publish state; a product referencing a deleted brand
- **Cart and orders**: empty; single line; quantity above stock; subtotal exactly at the free-delivery threshold and one cent either side; every payment method; every ordered pair of order statuses
- **Identity**: guest; signed in; expired session; locked account; unverified email; OTP replayed or expired
- **Viewport**: 320, 375, 414, 640, 768, 1024, 1280, 1440, 1920   and the exact boundary of any breakpoint touched
- **Interaction**: mouse, keyboard, touch; every dialog dismissed by each of its routes
- **Environment**: storage unavailable (private mode); image 404; API unreachable or slow; maintenance mode

A row with no coverage needs a written waiver, not silence.

## 4. Write the acceptance criteria

EARS form, each naming how it will be proved:

```
AC-1  WHEN the subtotal is exactly LKR 50,000
      THE SYSTEM SHALL charge no delivery fee.
      Proof: ShippingPolicy.test.ts, boundary case.

AC-2  WHEN the catalogue grid renders below 640px
      THE SYSTEM SHALL show exactly one product card per row.
      Proof: measured gridTemplateColumns track count at 320/375/414/639.
```

Unhappy paths are requirements. If every criterion describes success, the set is incomplete.

## 5. Close with

- **Out of scope**, explicitly, so the boundary is agreed rather than assumed
- **Impact**: which layers, which of the 554 existing tests could plausibly break, whether the deployed site is affected
- **Open questions**: every decision only the user can make, asked before design begins

## Rules

- Anything touching money, stock or an order is specified to the boundary: exactly at the threshold, and one either side.
- No speculation as fact. "Probably" means go and read it.
