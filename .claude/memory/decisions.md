# Decisions

Choices made, with the alternative and why it lost. Recorded so a later reader does not re-litigate them or quietly reverse them.

**D1   Monorepo with npm workspaces, storefront moved to `apps/web`.**
*Alternatives:* new folders beside `src/` in the existing layout, or separate repositories.
*Why:* the admin portal and the API need to share contracts, and duplicated types drift. Separate repos would need a published package for anything shared.
*Cost:* every path moved. Mitigated by pinning the build output to the repository root `dist/` so Render needed no change   proven by identical asset hashes before and after.

**D2   No test framework. Node's built-in runner.**
*Alternative:* Vitest or Jest.
*Why:* the domain is plain TypeScript with no DOM dependency, so the runner is sufficient. It keeps the dependency count at three runtime packages and removes a large transitive tree from the supply chain.
*Cost:* no watch-mode niceties, and `--experimental-transform-types` is required.

**D3   Fitness functions as scripts, not lint rules.**
`check-architecture`, `check-responsive` and `check-contact-details` are plain Node scripts in `npm run verify`.
*Alternative:* ESLint with custom rules.
*Why:* each encodes a project-specific invariant that no off-the-shelf rule expresses, and a script can be *proven to catch* a deliberate violation. Each was verified that way rather than trusted.

**D4   Contracts live in `packages/shared`, including the pure rules.**
Order-status transitions, permission resolution, refund arithmetic, schedule windows and discount percentage are shared functions, not re-implemented per app.
*Why:* both ends must agree on these rules. Two implementations drift silently until a customer sees the disagreement.

**D5   Taxonomy becomes data; `Product` references it by id.**
*Current state:* `ProductCategory` and `Brand` are TypeScript union types, and sub-category is free text.
*Why:* adding a brand today requires a code edit, a rebuild and a redeploy, so the catalogue cannot be managed from an admin portal at all.
*Cost:* referential integrity must now be enforced server-side, which the union types gave for free.

**D6   Admin accounts are a separate collection from customers, with permission-based RBAC.**
*Alternative:* a role flag on customer accounts.
*Why:* reusing the customer stack means one leaked shopper password, or one bug in storefront sign-in, reaches the catalogue and the order book.
*Detail:* guards check *permissions*; roles are bundles resolved once at the edge. Checking roles at call sites is what makes permission systems ossify.

**D7   Analytics is first-party and consent-aware by construction.**
*Alternative:* a third-party tag.
*Why:* the cookie drawer already promises nothing is shared with third parties, so a tag would make that copy a lie. Without consent a visit is counted under a daily-rotating hash   a property of the schema, not a setting someone can forget.

**D8   Deletion is soft everywhere.**
*Why:* an order line pointing at a product deleted last year must still render, and an audit trail that can be emptied is not an audit trail.

**D9   Compact grid density keeps two cards per row on phones.**
*Alternative:* one card at every density.
*Why:* the setting is labelled "More products per row". Collapsing it on mobile would make it identical to comfortable there, so the control would do nothing on the devices where a denser grid matters most, and its own description would be false.
*Verified:* at 375px comfortable renders 1 column and compact renders 2; at 1280px, 4 and 5.

**D10   Social links render inactive until their URL is set.**
*Alternative:* hide them, or link to a placeholder.
*Why:* a dead social link on a live storefront looks like a fault, and on Facebook or Instagram a wrong handle lands a customer on someone else's page. Setting `url` in `CompanyProfile` turns one into a real link with no other change.
