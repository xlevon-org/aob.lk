---
name: regression
description: Run the full ZOVAX verification across every workspace - typecheck, the three fitness functions, all 554 tests, and the production build - and report the real pasted counts. Use before any merge or deploy, and after any change that could reach beyond the file it touched.
---

# Regression

## Full run

From the repository root:

```
npm run verify
```

Which runs, per workspace:

| Gate | What it proves |
|---|---|
| `check:secrets` | no credential-shaped string in any tracked file; runs first, at the repository root |
| `typecheck` | TS 5.8 strict, `verbatimModuleSyntax`, `noUncheckedIndexedAccess` |
| `check:arch` | the dependency direction holds; inner layers touch no platform globals |
| `check:responsive` | six rules: fixed-width overflow at 320px, a grid with no mobile base, a visible scrollbar, an unanchored scroll track, nowrap inside a flex-1 element, and a tap target under 36px |
| `check:contact` | no superseded address, number or mailbox anywhere; no claim ZOVAX is an importer; live details only in `CompanyProfile` |
| `test` | 457 storefront + 97 shared, on Node's runner |

Then confirm the build still works:

```
npm run build
```

It must emit `dist/index.html`, `dist/assets/`, `dist/logo/` and `dist/products/` at the **repository root**. Compare the asset hashes with the previous build: unchanged hashes prove a refactor was genuinely a no-op, and are a warning when the change was meant to be visible.

## Scoped run

```
node --experimental-transform-types --test "apps/web/src/**/<area>*.test.ts"
```

For the inner loop only. **Nothing is declared done on a scoped run.**

## Reading a failure

- **`check:arch`** names the file and the illegal import. Fix the placement, not the rule.
- **`check:responsive`** names the rule and line. All four rules were written against real defects and are usually right.
- **`check:contact`** means a contact detail was written as a literal, or a superseded one returned.
- **A test failure after a data change** is often the test being correct: removing a product broke a discount expectation table that asserts its own size, which is exactly what that assertion is for.

## Rules

- Paste the real counts. "All tests pass" without `ℹ pass 457` is not evidence.
- A red gate blocks everything downstream. Do not proceed to deploy on red.
- If a fitness function fails, read the finding before changing code.
