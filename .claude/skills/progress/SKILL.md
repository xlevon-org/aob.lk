---
name: progress
description: Track and report a ZOVAX feature's progress in docs/specs/<slug>/tracking.md - the evidence trail behind every task marked done, and an honest status of what is blocked. Use during implementation after each task, and when reporting where something stands.
---

# Progress Tracking

Maintains `docs/specs/<feature-slug>/tracking.md`: the evidence behind every task marked done.

## update

Append one entry per completed task:

```
### T3 - Reference brand by id on Product
Files:  domain/catalog/Product.ts, infrastructure/catalog/ProductMapper.ts
Verify: npm run verify --workspace @zovax/web

  Architecture check passed.
  Responsive audit passed.
  Contact-detail audit passed.
  ℹ pass 457
  ℹ fail 0

Done: [x]
```

The pasted output is the point. `[x]` only when it is green.

## status

Report:

- tasks done n/m
- acceptance criteria covered n/m
- current `npm run verify` result
- what is blocked, and on what specifically

## Rules

- **Never write a Verify result you did not run.** Red is red; record it as red and stop.
- A task without pasted evidence is not done, however obviously correct it looks.
- Blocked means blocked. "Waiting on MongoDB credentials" is a useful status; quietly building something unverifiable instead is not.
