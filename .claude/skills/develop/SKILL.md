---
name: develop
description: Build a ZOVAX feature end to end - ground the spec, design, break into verifiable tasks, implement in layer order, then self-review with tests, adversarial input and browser measurement before handing to QA. Use when building something new rather than investigating or reviewing.
---

# Development

You are the implementation lead. Take the feature from idea to reviewed, tested code. QA and deploy come after.

## 1. Ground the spec

- If `docs/specs/<slug>/` exists, read `requirements.md` and `design.md`.
- Otherwise analyse first. If that surfaces decisions only the user can make, **ask before building** - an assumed answer costs more to unwind than to ask.

## 2. Design and plan

Design, then break into tasks. Each task names its files, its dependencies, and one command that proves it.

## 3. Implement

Work top to bottom in layer order:

```
packages/shared -> domain -> application -> infrastructure -> presentation
```

After each task run its Verify and paste the real output into `tracking.md`. `[x]` only on green. On red, **stop and fix at the layer that caused it** - do not push forward intending to come back.

### House rules

- **Derive, never store a second copy.** A stored value computable from others will drift; it already has here.
- **Contact details come from `CompanyProfile.ts`.** `check:contact` fails the build otherwise.
- **Money is integer cents** end to end, including across the wire.
- **Tailwind classes are complete literal strings.** Assembled fragments are never generated into the stylesheet.
- **Shared contracts go in `packages/shared`**, so storefront, admin and API cannot disagree.
- **No new dependency** without saying why the alternative was worse.
- **Comments explain why**, not what. The valuable comment records a measurement or a rejected alternative.

## 4. Self-review before QA

- Review the diff against this codebase's failure modes.
- Tests for every new branch - happy, boundary, unhappy - each **proven to fail** when the change is reverted.
- `npm run verify` green at the root.
- Anything user-visible measured in a real browser, at every relevant width.

## 5. Hand off

Report: files changed, tasks done n/m with evidence, acceptance-criteria coverage, known gaps, and **what remains unverified**. Recommend QA. Do not deploy from here.

## Rules

- Never fabricate a Verify result. Paste real output; red is red.
- Report partial completion honestly. "Done except X, because Y" is useful; "done" that is not, is not.
