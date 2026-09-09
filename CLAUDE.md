# ZOVAX SOLUTIONS.LK

Monorepo for a Sri Lankan hardware dealer's storefront, plus the admin portal and API being built alongside it.

```
apps/web         storefront    React 19 + Vite 6 + Tailwind v4 + TS 5.8 strict
apps/api         backend       NestJS + MongoDB + Cloudinary   (not yet built)
apps/admin       admin portal  React 19 + Vite                 (not yet built)
packages/shared  contracts compiled against by all three
```

## Before claiming anything works

```
npm run verify      # secret scan, then per workspace: typecheck, 3 fitness functions, 554 tests
```

Paste the real counts. `ℹ pass 457` and `ℹ pass 97` are evidence; "tests pass" is not.

## Invariants

Violating one of these is a defect, not a style disagreement. The full list with its evidence is in `.claude/memory/invariants.md`.

1. **Layer direction**   `domain <- application <- infrastructure <- presentation`. Nothing imports outward; `domain` and `application` touch no platform globals. Enforced by `check:arch`.
2. **Money is integer cents** everywhere   in the domain, across the wire, at rest. No float arithmetic, no rounding before the final step.
3. **Never store a derivable value.** A stored `discountPercentage` drifted from the two prices it is computable from in 3 of 13 records.
4. **Contact details live only in `CompanyProfile.ts`**   address, hotline, email, trading role. Enforced by `check:contact`.
5. **The build emits to the repository root `dist/`**, pinned in `apps/web/vite.config.ts`. Render publishes that path from a dashboard setting. Changing it breaks the live site with every test still green.
6. **`master` is the deploy branch.** There is no `main`, and no staging environment   pushing `master` deploys.
7. **Every horizontal scroll track is `relative`.** Enforced by `check:responsive`.
8. **Order lines copy** the product name, image, price and warranty at purchase. Renaming a product must not rewrite last month's invoice.
9. **No credential in any tracked file.** Real values live only in `.env`; `.env.example` holds placeholders. Enforced by `check:secrets`.

## How work is done here

`.claude/skills/` holds the method for each kind of task and auto-invokes on a description match. `.claude/commands/` are typed entry points into the same skills. `.claude/playbooks/` cover longer workflows. Read `.claude/memory/gotchas.md` before browser or CSS work   most entries are things that looked like one problem and were another.

## Standing constraints

1. **State assumptions before acting**, and verify them.
2. **Never claim correctness that was not verified.** Paste the evidence.
3. **Never handle only the happy path.** Enumerate the combinations.
4. **Say under what conditions it works**   and where it was not verified.

## Traps that have already cost time

- `overflow` on a **non-positioned** element does not clip absolutely positioned descendants. An `.sr-only` label escaping a carousel produced 1229px of horizontal scroll.
- Detect horizontal scroll with `win.scrollTo(4000,0)` then `scrollX`. `documentElement.scrollWidth` missed exactly that case.
- Tailwind classes must be **complete literal strings**; assembled fragments are never generated into the stylesheet.
- Node's test runner needs `--experimental-transform-types`, and `domain`/`application` imports need explicit `.ts` extensions.
- `convert` on this machine is the Windows FAT utility, not ImageMagick.
- The project directory has been renamed once (`syvix` → `zovax`). Never hardcode an absolute path.

## Current state

The storefront is complete and deployed. Every adapter is a fake or browser-local   `SeedProductRepository`, `FakeAuthService`, `FakePaymentGateway`, `LocalStorage*`   sitting behind ports, so swapping to HTTP is an infrastructure-layer change only.

`packages/shared` holds the contracts for the API and admin portal: catalogue, orders, content, admin RBAC, analytics, settings, with the pure rules shared so both ends cannot disagree.

**The catalogue is not yet manageable.** `ProductCategory` and `Brand` are TypeScript union types in `domain/catalog/Product.ts`; sub-category is free text. Adding a brand needs a code edit and a redeploy. Turning these into data is the prerequisite for the admin portal.

### Credentials

**Every credential the app needs is in `.env` at the repository root.** All 14
keys are populated: Mongo, Cloudinary, JWT access and refresh secrets, the seed
owner account, port, CORS origins and the storefront's API base URL.

`.env.example` also carries four `COMPANY_*` keys (see
`docs/specs/admin-and-api/design.md` section 7.4), for the one-time
company-profile migration. Those four are not yet in the real `.env`; they
are not part of the 14 the API needs to boot, and nothing reads them until
that migration task exists.

`.env` is gitignored at every depth   verified with `git check-ignore`, and it
does not appear even as an untracked file. `.env.example` is the only tracked
env file and holds placeholders only. **Never copy a real value out of `.env`**
into a commit, a log, a comment or a chat message; read it at runtime through
the config module.

Two things about the current values, recorded rather than silently worked around:

- The `MONGODB_URI` has **no database name in its path**, so a driver would
  default to `test`. The API therefore passes `dbName` explicitly in its
  Mongoose connection options, which overrides the URI path. Do not rely on the
  URI carrying it.
- The JWT secrets are 19 and 20 characters. `openssl rand -base64 48` produces
  ~64, which is the recommended strength for HS256. Worth regenerating before
  anything is exposed publicly.
