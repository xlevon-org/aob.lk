# Playbook: Code Review

**Use when** reviewing a diff or branch before it is considered done or merge-ready.

**The checklist itself lives in `/code-quality`.** This is the workflow around it: how to scope the review, what to look at per file type, and how to report.

**Related:** `/injection-test` (adversarial input), `/regression` (full suite), `/evaluate` (the gate before merge).

---

## Scope the real diff

Review what changed, never your memory of what was intended:

```
git diff master...HEAD --stat
git diff master...HEAD
```

`master` is the deploy branch. There is no `main`.

For a large diff, read the `--stat` first and decide an order: contracts and domain before presentation, because an error there is an error everywhere downstream.

## By file type

**`packages/shared/**`**   this is the contract three apps compile against. A wrong shape here is wrong in every consumer. Check: are the pure rules shared rather than duplicated? Is anything optional that should be required?

**`domain/**`**   no platform globals, no framework. Invariants enforced in the constructor. Failures returned as `Result`, not thrown, when they are expected business outcomes. Immutable.

**`application/**`**   depends on ports, never on adapters. A use-case that knows it is talking to MongoDB is misplaced.

**`infrastructure/**`**   implements a port exactly. Adapters may be fakes today; the seam must still be honest about what a real implementation will need.

**`presentation/**`**   Tailwind classes as complete literal strings. Every interactive element reachable by keyboard. Dialogs dismissible by button, Escape and outside press. No text that duplicates a contact detail owned by `CompanyProfile`.

**`*.test.ts`**   would each test fail if the behaviour regressed? Check by mutating, not by reading. Are boundaries pinned on both sides?

**`scripts/*.mjs`**   a fitness function that has never been seen to fail is not known to work.

## What to look for beyond correctness

- **Diff noise.** Reformatting mixed into a behavioural change hides the change. Ask for them separately.
- **Lost characters.** Scan for non-ASCII present on removed lines and absent on added ones   a scripted edit stripped em dashes from the page title here without anyone touching that line deliberately.
- **Comments that went stale.** A comment describing the old behaviour is worse than none.
- **A second source of truth** introduced quietly.

## Report

Findings most-severe first. Each: `file:line`, the concrete failure it causes, and a suggested fix. Separate **blocking** from **worth considering**   a review that treats every observation as equal gets skimmed.

Say plainly when a diff is clean. A review that always finds something teaches people to ignore it.
