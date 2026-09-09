---
name: architecture
description: Understand and explain the ZOVAX codebase - the monorepo layout, the four-layer storefront, where things live, how to trace a flow from component to adapter, and which invariants are enforced mechanically. Use when locating code, answering "how does X work", tracing a data flow, or onboarding into any part of the system before changing it.
---

# ZOVAX Architecture Guide

Read the code before asserting behaviour. Every claim cites `file:line`. A claim you did not open the file to check does not go in the answer.

## The monorepo

npm workspaces, from the repository root   the directory containing this `.claude/`. Do not hardcode an absolute path; the project directory has already been renamed once:

```
apps/web         storefront    React 19 + Vite 6 + Tailwind v4 + TS 5.8 strict
apps/api         backend       NestJS + MongoDB + Cloudinary   (not yet built)
apps/admin       admin portal  React 19 + Vite                 (not yet built)
packages/shared  contracts compiled against by all three
```

`npm install` at the root installs every workspace. `npm run verify` runs each workspace's gates.

## The four layers

`apps/web` is layered, and the dependency rule is enforced by a script rather than by convention:

```
domain  <-  application  <-  infrastructure  <-  presentation
```

| Layer | Holds | Must not |
|---|---|---|
| `domain/` | business rules, entities, value objects | touch `window`, `fetch`, React, or any I/O |
| `application/` | use-cases and ports | know which adapter backs a port |
| `infrastructure/` | adapters implementing ports | leak its shape into use-cases |
| `presentation/` | React components, contexts, composition root | contain business rules |

Enforced by `apps/web/scripts/check-architecture.mjs` (`npm run check:arch`), which checks both the import direction and inner-layer purity.

## Key domain objects

- **`Money`** (`domain/shared/Money.ts`)   value object over integer cents. Never a float, anywhere, including across the wire.
- **`Result<T, E>`** (`domain/shared/Result.ts`)   discriminated union for expected business failures. Throwing is for programmer error.
- **`Product`** (`domain/catalog/Product.ts`)   immutable, validates its invariants in the constructor (stock is a non-negative integer, rating within 0..5, original price not below price).
- **`Cart`** (`domain/cart/Cart.ts`)   immutable aggregate; every mutation returns a new cart plus a list of adjustments.
- **`Order`** (`domain/ordering/Order.ts`)   lines copy the product name, image, price and warranty at purchase.
- **`COMPANY`** (`domain/company/CompanyProfile.ts`)   the single source of truth for address, hotline, email and trading role.

## Ports, and what backs them today

Every adapter is currently a fake or browser-local. These are the seams the API will fill:

| Port (`application/ports/`) | Adapter today |
|---|---|
| `ProductRepository` | `SeedProductRepository`   a fixture |
| `CartRepository`, `OrderRepository`, `WishlistRepository`, `UserRepository` | `LocalStorage*` |
| `AuthService` | `FakeAuthService` |
| `PaymentGateway` | `FakePaymentGateway` |
| `WarrantyRegister` | `FakeWarrantyRegister` |
| `Clock`, `IdGenerator` | `SystemAdapters` |

Because those seams already exist, swapping to HTTP adapters is an infrastructure-layer change   no domain, application or UI code moves.

## How to trace a flow

1. Start at the presentation entry point   a component or a context.
2. Follow into the use-case in `application/usecases/`.
3. Note which port it depends on.
4. Find the adapter in `infrastructure/`.
5. Name the layer boundary at each hop. **A hop pointing outward is a finding**   report it, because `check:arch` should have caught it.

## Facts that change how you answer

- **The taxonomy is not data.** `ProductCategory` and `Brand` are TypeScript union types in `domain/catalog/Product.ts`; sub-category is free text. Adding a brand needs a code edit and a redeploy. This is why the catalogue is not yet manageable from an admin portal.
- **The build output path is load-bearing.** `apps/web/vite.config.ts` pins `outDir` to the repository root `dist/`, because Render publishes that path from a dashboard setting, not from a `render.yaml`.
- **Contact details are guarded.** `check-contact-details.mjs` fails the build if the address, hotline, email or trading role appears as a literal outside `CompanyProfile.ts`.
- **`master` is the deploy branch.** There is no `main`, and no staging environment.
- **Around twenty pieces of site content are module-level constants**   hero slides, trust points, testimonials, showrooms, districts, the enquiry and solution-builder option lists. `packages/shared/src/contracts/content.ts` names each one beside the type intended to replace it.

## Reporting

Answer with `file:line` for every claim. If something is genuinely ambiguous in the code, say so rather than picking the reading that makes a tidier answer.
