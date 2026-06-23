# Contributing & Conventions

This document describes how the codebase is organised and the conventions your
changes are expected to follow. The **Customer** slice is the canonical reference —
when in doubt, copy how it is done there.

---

## Backend layering

Requests flow through clear layers, each with a single responsibility:

```
route → middleware (validation) → controller → service → repository → SQLite
```

| Layer            | Responsibility                                                            | Directory            |
| ---------------- | ------------------------------------------------------------------------- | -------------------- |
| **routes**       | Wire HTTP method + path to validation middleware and a controller.        | `src/routes/`        |
| **middleware**   | Cross-cutting concerns: request validation, global error handling.        | `src/middleware/`    |
| **controllers**  | HTTP only — read the (validated) request, call a service, format the JSON. | `src/controllers/`   |
| **services**     | Business logic and orchestration. Throw typed errors. No SQL, no HTTP.    | `src/services/`      |
| **repositories** | The **only** place that touches the database.                             | `src/repositories/`  |
| **validators**   | Zod schemas, one file per resource.                                       | `src/validators/`    |
| **errors**       | `AppError` base class and its subclasses.                                 | `src/errors/`        |
| **db**           | Connection, schema, seed script, transaction helper.                      | `src/db/`            |
| **types**        | Domain entity interfaces.                                                  | `src/types/`         |

Rules that follow from this:

- **Controllers and services never import the database connection.** Only
  repositories import `db` from `db/connection.ts`.
- **`app.ts` builds the Express app; `server.ts` starts it.** This keeps the app
  importable in tests without opening a port.

---

## Naming conventions

- **Backend files** are camelCase with a role suffix:
  `customer.service.ts`, `customer.controller.ts`, `customer.repository.ts`,
  `customer.validators.ts`, `customer.routes.ts`. Error classes are the exception —
  they are PascalCase to match the class they export (`NotFoundError.ts`).
- **Frontend components** are PascalCase: `Button.tsx`, `Modal.tsx`,
  `ProductForm.tsx`. Everything else (API client modules, utilities) is camelCase:
  `client.ts`, `products.ts`, `format.ts`, `fieldErrors.ts`.
- Variables and functions are `camelCase`; types, interfaces, and classes are
  `PascalCase`.

---

## How to add an endpoint

Follow the Customer slice end to end. To add, say, a new product endpoint:

1. **Validator** — add (or extend) a Zod schema in
   `src/validators/product.validators.ts` and export the inferred input type.
2. **Repository** — add a function in `src/repositories/product.repository.ts` for
   any new database access. Keep all SQL here.
3. **Service** — add a method in `src/services/product.service.ts` with the business
   logic. Call the repository; throw a typed error on failure.
4. **Controller** — add a handler in `src/controllers/product.controller.ts` that
   reads the request, calls the service, and sends the response.
5. **Route** — wire it in `src/routes/product.routes.ts`, putting
   `validateRequest(schema)` (and `validateRequest(idParamSchema, 'params')` for
   `:id` routes) before the controller.

The `customer.*` files show every one of these steps.

---

## Error handling

- **Services throw typed errors; they never return error objects.** Use the
  `AppError` subclasses in `src/errors/`:
  `NotFoundError`, `BadRequestError`, `ValidationError`, `NotImplementedError`.
- The global `errorHandler` middleware (registered last in `app.ts`) catches every
  `AppError` and formats the standard response. Anything that is not an `AppError`
  becomes a generic `500`.
- Standard error response shape:

  ```json
  { "error": { "code": "NOT_FOUND", "message": "Product 42 not found" } }
  ```

  Validation errors additionally include a `fields` map:

  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "price": "..." } } }
  ```

- Need a new error category? Add a subclass in `src/errors/`, export it from
  `src/errors/index.ts`, and throw it — the error handler needs no changes.

---

## Validation

- Every resource has its schemas in `src/validators/<resource>.validators.ts`.
- Schemas are applied at the route via the `validateRequest(schema, source)`
  middleware, which validates `body` (default) or `params`. On failure it throws a
  `ValidationError` with a per-field message map; on success the parsed, trimmed
  value replaces the raw input so controllers receive clean data.
- Update schemas are the create schema made partial
  (`createProductSchema.partial()`), so a partial update reuses the same per-field
  rules.

---

## Testing

- Tests use **Vitest** and live in the **`backend/tests/`** directory (not
  alongside source files). This is the single, consistent location for all tests.
- Name files `<subject>.test.ts` (e.g. `productService.test.ts`).
- Tests run against an **in-memory SQLite database** (configured in
  `vitest.config.ts`). Call `resetDatabase()` from `tests/helpers/testDb.ts` in a
  `beforeEach` so each test starts clean.
- Test services directly (not over HTTP), as the existing suites do. Assert on
  behaviour and on the typed errors thrown (e.g. `expect(...).toThrow(NotFoundError)`).

---

## Frontend conventions

- **`app/api-client/`** is the only place that calls the backend. Use the shared
  `apiClient` wrapper — it parses the standard error envelope and throws a typed
  `ApiError`. Add per-resource calls in `products.ts` / `customers.ts`.
- **`app/components/`** holds small, reusable UI primitives (`Button`, `Input`,
  `FormField`, `ErrorMessage`, `Modal`). No third-party UI library.
- **Forms** display API errors with one consistent pattern: pass thrown errors
  through `toFormErrors` (`app/lib/fieldErrors.ts`) to get a form-level message plus
  a per-field map, then render fields through `FormField`. See `ProductForm` and the
  customers page.
- Use the `@/` import alias for everything under `app/` (e.g.
  `@/components/Button`).

---

## Code quality

- TypeScript is `strict`; **do not use `any`**.
- Run `npm run typecheck` and `npm run lint` in both projects before submitting —
  both should be clean.
- Match the surrounding style: formatting follows the root `.prettierrc`.
