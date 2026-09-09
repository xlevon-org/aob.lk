# .claude   project setup for ZOVAX

Committed, so it is shared rather than per-machine. Everything here describes **this** repository: a React 19 + Vite 6 + Tailwind v4 storefront, becoming a monorepo with a NestJS API and a React admin portal.

```
.claude/
  settings.json   hook wiring (committed; settings.local.json is not)
  skills/         the methods - auto-invoked on description match
  commands/       thin routers into the skills, for typed invocation
  playbooks/      longer workflows spanning several skills
  memory/         durable project knowledge
  scripts/        hook implementations, with tests
```

**Skills hold the content; commands route into them.** That matters: a skill
auto-invokes when its description matches what you asked for, so saying
"review this diff" applies the review method without typing `/code-quality`.
A command only fires when typed. Keeping the method in one place means the two
cannot drift.

## Commands

| Command | Purpose |
|---|---|
| `/build` | route a request through the whole gated pipeline |
| `/architecture` | explain the codebase, trace a flow, locate code with `file:line` |
| `/analyze` | investigate a request, then produce requirements |
| `/requirements` | assumptions, scenario matrix, EARS acceptance criteria |
| `/design` | layer placement, signatures, data flow |
| `/tasks` | numbered, individually verifiable checklist |
| `/develop` | build a feature through the whole chain |
| `/unit-tests` | tests on the Node runner, proven to fail on regression |
| `/test-plan` | scenario matrix, or audit an existing suite |
| `/injection-test` | adversarial input and forced failures |
| `/code-quality` | review the diff against this codebase's real failure modes |
| `/regression` | full verification across every workspace |
| `/responsive` | layout across the full width range, measured |
| `/e2e-verify` | prove behaviour in a real browser with measured values |
| `/smoke-test` | fast build-serve-render check |
| `/evaluate` | GO / NO-GO against every acceptance criterion |
| `/qa` | the full sweep, ending in a verdict |
| `/deploy` | gated ship to Render via `master` |
| `/progress` | track tasks and their evidence |
| `/memory` | read, update and audit durable knowledge |

## Skills

Twenty project skills mirroring the commands, plus `firecrawl` (a vendor tool
skill, kept because it is project-agnostic). Each states the method for this
codebase specifically   the measurement that detects horizontal scroll, the
two flags Node's test runner needs, the six responsive rules, the layer
placement test.

## Playbooks

`BUG_INVESTIGATION` · `CODE_REVIEW` · `DEPLOYMENT_SAFETY` · `FEATURE_IMPLEMENTATION`

## Memory

`invariants.md`   rules that must hold, and what enforces each.
`gotchas.md`   traps already paid for once, with the measurement that revealed each.
`decisions.md`   choices made, with the alternative and why it lost.

Read `invariants.md` before any non-trivial change. Keep it short: if it grows past a screen, it has stopped being a set of invariants.

## Hooks

Wired in `settings.json`, both **fail open**   any malfunction exits 0 and never blocks work.

- **PreToolUse / Write** → `verify-prewrite.mjs`. Blocks a Write of malformed JSON, or of a JSX attribute set to the literal `undefined` (a real defect here twice: `className={undefined}` type-checks and renders broken). Deliberately does *not* compile TypeScript   per-write compilation is slow, `npm run typecheck` covers it, and a slow gate gets disabled.
- **SessionStart / compact|resume** → `state-injector.mjs`. Re-injects branch, commit, working-tree state and the project invariants after a context compaction.

Tested:

```
node --test .claude/scripts/hooks.test.mjs
```

38 tests, covering the block paths, the allow paths, and every malformed-payload variation   a gate that blocks legitimate work is worse than no gate.

## Standing constraints

These apply to every task in this repository:

1. State assumptions before acting, and verify them.
2. Never claim correctness that has not been verified. Paste the evidence.
3. Never handle only the happy path. Enumerate the combinations.
4. Say under what conditions something works   and where it was not verified.

## History

The 17 Prime-specific skills were rewritten for this project rather than
discarded; only `deploy-local` and `deploy-production` were dropped, because
this project has neither a Docker stack nor a HuggingFace Space. Their content
merged into a single `deploy` skill for Render.

These files were adapted from a different project ("Prime", a Python trading engine). Everything referring to Docker, pytest, MongoDB-in-a-container, HuggingFace Spaces, a `prod` branch, `run_engine.py` or money-trading has been rewritten or removed, because none of it exists here.
