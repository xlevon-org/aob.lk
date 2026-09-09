# ZOVAX SOLUTIONS.LK

Monorepo for ZOVAX SOLUTIONS.LK, an authorised Sri Lankan hardware dealer.

```
apps/web       storefront          React 19 + Vite + Tailwind v4
apps/api       backend service     NestJS + MongoDB + Cloudinary
apps/admin     admin portal        React 19 + Vite + Tailwind v4
packages/shared  contracts shared across the three
```

`npm install` at the root installs every workspace. `npm run build` builds the
storefront to the repository root's `dist/`, which is what the Render service
publishes   the path is fixed in `apps/web/vite.config.ts` so the restructure
did not require a deployment change.

The catalogue
covers three verticals:

- **CCTV & security systems**   Hikvision cameras, NVRs and DVRs
- **Computers & PCs**   Dell, HP, Lenovo and Asus laptops, desktops and workstations
- **Accessories**   Baseus chargers, power banks, hubs and audio

Prices are in Sri Lankan Rupees. Delivery is island-wide and free at or above
LKR 50,000.

---

## Status

This is a **front-end application with no backend**. The catalogue is seeded
from a fixture, and carts, orders, wishlists and profile data persist to the
browser's `localStorage`. Payment authorisation and warranty-serial lookup run
against in-process fakes.

Those fakes sit behind interfaces (`PaymentGateway`, `WarrantyRegister`,
and the repository ports), so replacing them with HTTP clients is a change to
the infrastructure layer only   no domain, application or UI code moves.
`src/prisma.schema.txt` records the intended PostgreSQL schema for that work.

---

## Getting started

Requires **Node.js 22.6 or newer** (the test runner relies on Node's built-in
TypeScript support).

```bash
npm install
npm run dev          # http://localhost:5000
```

No environment variables or API keys are required.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 5000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Node's built-in runner) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:arch` | Enforce the architectural dependency rule |
| `npm run verify` | typecheck + architecture check + tests |

Run `npm run verify` before pushing. It is the same set of checks described
under [Verification](#verification).

---

## Architecture

The code is arranged in four layers. **Dependencies only ever point inward**,
so the business rules do not know that React, a browser, or `localStorage`
exist.

```
┌─────────────────────────────────────────────────────────────┐
│ presentation   React components, hooks, composition root    │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ infrastructure   localStorage repositories, fakes     │ │
│   │                                                       │ │
│   │   ┌─────────────────────────────────────────────────┐ │ │
│   │   │ application   use-cases + port interfaces       │ │ │
│   │   │                                                 │ │ │
│   │   │   ┌───────────────────────────────────────────┐ │ │ │
│   │   │   │ domain   entities, value objects, rules   │ │ │ │
│   │   │   │          imports nothing at all           │ │ │ │
│   │   │   └───────────────────────────────────────────┘ │ │ │
│   │   └─────────────────────────────────────────────────┘ │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

| Layer | May import | May not import |
| --- | --- | --- |
| `domain` | itself only | anything else, including npm packages |
| `application` | `domain` | infrastructure, presentation, npm packages |
| `infrastructure` | `domain`, `application` | presentation |
| `presentation` | all inner layers |   |

This is not a convention that reviewers must remember. It is checked by
`npm run check:arch`, which fails the build on violation.

### `src/domain`   business rules

Pure TypeScript. No framework, no I/O, no platform globals.

| Module | Responsibility |
| --- | --- |
| `shared/Money` | LKR value object over integer cents, so money arithmetic is exact |
| `shared/Result` | Explicit success/failure union; failures appear in type signatures |
| `catalog/Product` | Product entity, availability and pricing rules |
| `catalog/CatalogQuery` | Filtering and sorting as pure, composable functions |
| `cart/Cart` | Immutable basket aggregate owning every stock rule |
| `cart/ShippingPolicy` | Free-delivery threshold, injectable rather than hard-coded |
| `ordering/Order` | Order entity, line-item snapshots, total arithmetic |
| `warranty/WarrantySerial` | Serial-number format rules |

Two decisions worth knowing:

**Money is held in cents.** Prices are integers, so `0.1 + 0.2` cannot drift
into `0.30000000000000004` as discounts and taxes are introduced later.

**Discount percentage is derived, not stored.** It is computed from the current
and original price, so it cannot disagree with the prices it describes.

### `src/application`   use-cases and ports

Each use-case is one operation, depending only on interfaces it declares. It
does not know whether a repository is backed by `localStorage`, HTTP, or a test
double.

### `src/infrastructure`   adapters

Implementations of the ports: `localStorage`-backed repositories, the seeded
product catalogue, and the payment and warranty fakes.

### `src/presentation`   UI

React components and the composition root that wires concrete adapters into
use-cases. This is the only place where a concrete implementation is chosen.

---

## Verification

Correctness claims in this repository are backed by checks you can run.

### `npm test`

Unit tests on Node's built-in runner. No test framework is installed.

Business rules are covered by **explicit condition matrices** rather than
happy-path examples. `Cart.add`, for instance, is exercised across the product
of availability × stock on hand × units already in the basket × requested
quantity, including every boundary (a request landing exactly on the stock
ceiling is accepted; one unit beyond is refused) and every invalid input
(negative, zero, fractional, `NaN`, `Infinity`).

Expected results in those matrices are written from the requirements. They are
deliberately *not* derived from a helper that mirrors the implementation, which
would make the tests agree with the code by construction and prove nothing.

The suite is mutation-checked: changing the stock comparison from `>` to `>=`
fails six tests, and deleting the out-of-stock guard fails one.

### `npm run check:arch`

Enforces two independent properties and exits non-zero on violation:

1. **Dependency direction**   no module imports from a layer further out.
2. **Inner-layer purity**   `domain` and `application` may not reference
   `window`, `document`, `localStorage`, `fetch`, or any npm package.

The checker itself is verified against deliberate violations of each class.

### `npm run typecheck`

`tsc --noEmit` under `strict`.

> Note for anyone auditing history: before commit `acda79d`, this project had
> no `@types/react`, so every React import resolved to `any` and `tsc` exited 0
> while checking essentially nothing. If you fork an older revision, install
> the React types before trusting a green type-check.

---

## Project layout

```
src/
  domain/
    shared/          Money, Result
    catalog/         Product, CatalogQuery
    cart/            Cart, ShippingPolicy, CartErrors
    ordering/        Order
    warranty/        WarrantySerial
  application/
    ports/           repository and service interfaces
    usecases/        PlaceOrder, ManageCart, BrowseCatalog, VerifyWarranty
  infrastructure/
    catalog/         seed fixture, ProductMapper, SeedProductRepository
    storage/         KeyValueStore and localStorage repositories
    payment/         FakePaymentGateway
    warranty/        FakeWarrantyRegister
    system/          SystemClock, RandomIdGenerator
  presentation/
    composition/     container.ts - the only place concretes are named
    contexts/        one provider per concern
    components/      React components
    format/          money and message formatting
  index.css
  main.tsx
  prisma.schema.txt  intended PostgreSQL schema (not wired up)
scripts/
  check-architecture.mjs
```

---

## Conventions

- **Imports inside `domain` and `application` carry explicit `.ts` extensions.**
  Node's TypeScript support resolves module specifiers literally, so
  `from './Money'` fails where `from './Money.ts'` works. This is what makes
  the layers runnable under `node --test` without a bundler.
- **Type-only imports use `import type`.** Required under `isolatedModules`,
  and required again by Node's transform, which emits the import at runtime.
- **Domain objects are immutable.** Operations return new instances rather than
  mutating in place, so React's reference-equality checks stay meaningful.

---

## Licence

Proprietary. © ZOVAX SOLUTIONS.LK.
