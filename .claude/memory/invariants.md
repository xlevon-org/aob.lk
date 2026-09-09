# Invariants

Rules that must hold. Violating one is a defect, not a style preference. Each is enforced by something, or states what it would break.

**I1** The dependency direction is `domain <- application <- infrastructure <- presentation`. No module imports from a layer further out, and `domain`/`application` touch no platform globals.
*Enforced:* `apps/web/scripts/check-architecture.mjs` via `npm run check:arch`.

**I2** Money is an integer number of cents everywhere   in the domain, across the wire, and at rest. No float arithmetic on money, and no rounding before the final step.
*Why:* a price correct in the domain and rounded in transit is still wrong on the invoice.

**I3** A value derivable from others is never also stored.
*Evidence:* a hand-maintained `discountPercentage` sat beside the two prices it is computable from and disagreed with them in 3 of 13 seed records. It was deleted, and `discountPercentage()` derives it.

**I4** The address, hotline, email and trading role exist as literals only in `apps/web/src/domain/company/CompanyProfile.ts`.
*Enforced:* `check-contact-details.mjs`, which also fails on any superseded value and on any claim that ZOVAX is an importer rather than a dealer.

**I5** The storefront build emits to the **repository root** `dist/`, pinned in `apps/web/vite.config.ts`.
*Why:* Render builds from the repo root and publishes `dist/`, configured in its dashboard. Changing this path without changing Render deletes the published directory on the next push.

**I6** `master` is the deploy branch and there is no `main`. A push to `master` deploys the live site; there is no staging environment.

**I7** Every horizontal scroll track is a positioning context (`relative`).
*Enforced:* the `unanchored-scroll-track` rule in `check-responsive.mjs`. See `gotchas.md` G1 for the 1229px overflow this prevents.

**I8** Order lines copy the product name, image, price and warranty at purchase rather than referencing them.
*Why:* an order records what was agreed. Renaming a product must not rewrite last month's invoice.

**I9** No credential appears in any file git tracks. Real values live only in `.env`, which is ignored at every depth; `.env.example` holds placeholders.
*Enforced:* `scripts/check-secrets.mjs` via `npm run check:secrets`, which runs first in `npm run verify`.
*Evidence:* a live MongoDB username, password and cluster host were written into `.env.example` - the one file deliberately exempt from the `.env*` ignore rule - and were staged to be committed. Caught before any commit, but only by chance. The scan later found a second leak nobody was looking for: a Firecrawl API key inside a vendor skill document.
