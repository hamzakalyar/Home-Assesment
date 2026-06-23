# DiscreteLogix Engineering Assessment

Welcome, and thank you for taking the time to work on this assessment.

This is a small full-stack catalog application (customers and products) built as a
monorepo. The **Customer** feature is fully implemented and is your reference — it
shows the exact conventions and patterns used throughout the codebase. The
**Product** feature is mostly implemented; completing it is your job.

You have **two tasks**. Plan for roughly **1.5 hours** of focused work, and submit
within **48 hours**.

---

## What's in the box

```
discretelogix-assessment/
├── backend/    Node.js + Express + TypeScript + SQLite + Zod + Vitest
└── frontend/   Next.js (App Router) + TypeScript + Tailwind CSS
```

The backend is organised into clear layers — `controllers → services →
repositories` — with `validators`, `middleware`, `errors`, and `db` helpers
alongside. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before you start: it explains
where code goes and the conventions you are expected to follow.

---

## Setup

Requirements: **Node.js 20–22** (an `.nvmrc` pinning Node 22 is included in each
project; run `nvm use` if you use nvm). The backend uses `better-sqlite3`, which
ships prebuilt binaries for these versions.

The backend and frontend are independent projects — install each one:

```bash
# Terminal 1 — backend
cd backend
npm install
npm run seed     # create and populate the SQLite database (5 customers, 8 products)
npm run dev      # API on http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev      # app on http://localhost:3000
```

The frontend talks to the backend at `http://localhost:4000` by default. To point
it elsewhere, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.

Useful backend scripts: `npm test` (Vitest), `npm run typecheck`, `npm run lint`,
`npm run seed` (reset + repopulate the database).

---

## Task A — Implement `updateProduct`

The Product service already implements `createProduct`, `getProductById`,
`listProducts`, `searchProducts`, and `deleteProduct`. **Study these — they are
worked examples of the patterns you should follow.** Do **not** modify them.

One method is left for you:

- **`updateProduct(id, input)`** in
  [`backend/src/services/product.service.ts`](./backend/src/services/product.service.ts)
  — a **partial update**: only the fields provided in `input` change, each provided
  field is validated with the same rules as on create (already enforced by
  `updateProductSchema`), and a `NotFoundError` is thrown if no product with that id
  exists. Return the updated product.

  The `updateCustomer` method in `customer.service.ts` is the reference to follow.

Then, in
[`backend/tests/productService.test.ts`](./backend/tests/productService.test.ts),
remove `.skip` from the two `updateProduct` tests and make them pass:

1. `updateProduct updates only the provided fields`
2. `updateProduct throws NotFoundError for a nonexistent id`

The full test suite should pass: `npm test`.

**Frontend check:** the Products page (`/products`) already supports listing,
creating, deleting, and searching. The **Edit** button is fully wired — it opens a
modal and calls the API — but the request returns `501 Not Implemented` until you
finish `updateProduct`. Once the method works, verify that editing a product saves
the change and refreshes the list.

---

## Task B — Add a stock-adjustment endpoint

Build this from scratch, following the patterns established by the existing slices.
Nothing for it exists yet.

### Backend — `POST /api/products/:id/adjust-stock`

Adjust a product's stock by a delta. Request body:

```json
{ "delta": -3, "reason": "Damaged units removed from inventory" }
```

Requirements:

- **`delta`** — a non-zero integer (may be positive or negative).
- **`reason`** — a string, 3–200 characters.
- **Cannot reduce stock below zero.** If the adjustment would make stock negative,
  respond with **400** and this body:
  `{ "error": { "code": "INSUFFICIENT_STOCK", "message": "..." } }`
- **Must be transactional.** Read the current stock, validate the adjustment, and
  write the new stock as one atomic operation (use the `withTransaction` helper in
  `db/transaction.ts`).
- On success, respond with the **updated product**.

You will add: a Zod schema (in `validators/`), a service method, a controller
handler, and the route wiring. Comment markers show where the route
(`product.routes.ts`) and the API client call (`frontend/app/api-client/products.ts`)
should go.

### Frontend — "Adjust Stock" on `/products`

A starting point is scaffolded for you: each product row already has an **Adjust
Stock** button that opens a **stub modal**
([`AdjustStockModal.tsx`](./frontend/app/products/components/AdjustStockModal.tsx)).
Build out the modal's contents:

- a **delta** input (must allow negative numbers),
- a **reason** input,
- inline display of the validation error if the adjustment would take stock below
  zero (i.e. the `INSUFFICIENT_STOCK` response).

On success, the modal closes and the product list refreshes. Reuse the shared
`Modal` component and the existing field-error pattern — see how `EditProductModal`
and `ProductForm` are built. (The stub file lists these steps inline.)

---

## Validation rules (reference)

| Field            | Rule                                             |
| ---------------- | ------------------------------------------------ |
| Product `name`   | trimmed, 2–100 characters                        |
| Product `price`  | positive number, at most 2 decimal places        |
| Product `stock`  | non-negative integer                             |

Validation failures return **400** with:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "price": "..." } } }
```

---

## Rules

- **AI tools are permitted, but must be disclosed.** In your Loom video, briefly say
  what you used them for. This is not held against you.
- **You must be able to explain your own code.** Submissions where the candidate
  cannot walk through and justify their changes will be rejected, regardless of
  whether the code works.

---

## Submitting

1. Push your work to a **public Git repository** and share the link.
2. Record a **3–5 minute Loom video** walking through your changes: how you
   implemented `updateProduct`, how your stock-adjustment endpoint works (especially
   the transactional part), and a quick demo of both features in the UI.

---

## How submissions are evaluated

- **Pattern adherence** — does your code match the conventions of the existing
  slices (layering, error handling, validation, naming)? See
  [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Transactional integrity** — is the stock adjustment genuinely atomic and safe
  against going below zero?
- **Working tests** — do the unskipped tests (and any you add) pass?
- **Clarity** — clean, readable code, and a clear explanation in your video.
