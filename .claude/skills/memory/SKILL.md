---
name: memory
description: Read, update and audit ZOVAX's durable knowledge in .claude/memory/ - invariants that must hold, gotchas already paid for once, and decisions with the alternative that lost. Use before a non-trivial change, and after learning something expensive that will be needed again.
---

# Memory

`.claude/memory/` holds facts about **this project** that are expensive to rediscover and not obvious from the code. It is committed, so it is shared rather than per-machine.

```
memory/
  invariants.md   rules that must hold; violating one is a defect
  gotchas.md      traps already paid for once, with the measurement
  decisions.md    choices made, with the alternative and why it lost
```

## Read

Before any non-trivial change, read `invariants.md`. It is short on purpose: if it grows past a screen, it has stopped being a set of invariants and become documentation.

Read `gotchas.md` before browser work or CSS work specifically   most entries there are things that looked like one problem and were another.

## Update

Add an entry when something was **expensive to learn and will be needed again**:

- an invariant a future change could silently break
- a trap that cost real time, with the measurement that revealed it
- a decision whose rationale would otherwise be lost

Each entry carries its evidence. Compare:

- Folklore: "dropdowns must be portalled"
- Fact: "the header search form sets `overflow-hidden` to clip its corners, which clipped the menu to a measured 0x0 - present in the DOM, invisible, unhittable"

The second can be acted on. The first gets cargo-culted.

**Do not record what the repository already says**: file structure, what a function does, or anything git history holds.

## Verify

Re-check each entry against the current code. An invariant naming a file, function or flag that no longer exists is worse than no entry - it is confidently wrong. Fix it or delete it.

## Audit

Report entries that are stale, unevidenced, duplicated, or that merely restate the code. Removing a bad entry is as valuable as adding a good one: memory that cannot be trusted gets ignored, and then the good entries are ignored too.
