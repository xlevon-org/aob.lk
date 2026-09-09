---
name: analyze
description: Investigate a ZOVAX request or subsystem before proposing anything - read the real code, find what is hardcoded, map every consumer, check the tests, and synthesise into requirements plus the decisions only the user can make. Use when a request is new, broad, or touches code you have not read this session.
---

# Analysis

Understand before proposing. The output is a written understanding plus requirements - not code, and not a plan to write code.

## 1. State assumptions first

Write down what you are assuming *before* reading. Then verify each against the repository and mark it `[verified: file:line]` or `[unverified]`. An unverified assumption that changes the work is a question for the user.

## 2. Investigate

Read the real code. Cover at minimum:

- **What exists now**, with `file:line`. Which layer owns it, which use-case reaches it, which adapter backs it.
- **What is hardcoded** that this change needs to be dynamic. This repository is full of constants that look like data: the product taxonomy is a TypeScript union type, and about twenty pieces of site content are module-level constants.
- **Who depends on it.** Grep for every consumer, not the obvious one. Widening `Product` touched eight sort and facet call sites.
- **What tests cover it**, and whether they would fail if the behaviour regressed.
- **What the deployed site does today**, if the change is user-visible. Measure it in the browser rather than inferring from source.

## 3. Synthesise

Produce requirements: assumptions with evidence, current behaviour, the scenario matrix, EARS acceptance criteria, out-of-scope, impact.

## 4. Surface decisions

List every choice that materially changes the design and cannot be resolved from the code - schema shape, cutover strategy, auth model, where new code lives. **Ask them before design starts**, not after implementation has assumed an answer.

## Rules

- No speculation presented as fact. "Probably" and "should be" mean go and read it.
- If a claim cannot be backed by `file:line` or a measured value, it does not go in the analysis.
- Report what you could not determine. A gap named is useful; a gap papered over is not.
