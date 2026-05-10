# Project Standards

This document defines the working structure for Frozeria Next. Keep it updated when the architecture changes.

## Application Shape

Use Next.js App Router as the routing layer only. Route files in `src/app/**` should import feature components and avoid business logic, data shaping, and large UI implementation.

```text
src/app           routing, layouts, metadata, API route handlers
src/features      page-level and domain-specific UI
src/modules       browser API clients, query hooks, DTOs, query keys
src/server        database, repositories, services, validation, server helpers
src/commons       shared constants, enums, and types
src/components    reusable layout, providers, and shared UI
src/lib           reusable client/shared integrations
src/utils         pure utility functions
tests/unit        Vitest unit, service, API contract, and backend module tests
tests/e2e         Playwright browser smoke tests by feature module
```

## Feature Module Pattern

Each feature folder should keep its own UI copy and local constants.

```text
src/features/dashboard/
|-- constants.ts
`-- dashboard-page.tsx

src/features/categories/
|-- constants.ts
|-- category-page.tsx
|-- category-form.tsx
`-- category-table.tsx

src/features/items/
|-- constants.ts
|-- item-form.tsx
|-- item-table.tsx
|-- item-detail.tsx
`-- delete-item-modal.tsx
```

Rules:

- Do not put user-facing copy directly in route files.
- Keep shared app metadata, navigation labels, and route paths in `src/commons/constants`.
- Keep feature-specific labels, table headers, empty states, and placeholder data in that feature folder.
- Move reusable UI to `src/components/shared` only after it is used by more than one feature.

## Data Flow

Use this flow for persisted features:

```text
Page route -> Feature UI -> Query hook -> Client API -> API route -> Service -> Repository -> Database
```

Rules:

- Client components must not import from `src/server/**`.
- Feature UI must not query the database directly.
- API routes may import from `src/server/**`.
- Repositories own database access.
- Services own business rules.
- `src/modules/**/api.ts` owns browser API calls.
- `src/modules/**/queries.ts` owns TanStack Query hooks.

## Environment

Keep `.env.example` complete and safe to commit. Local secrets belong in `.env.local`, not in git.

Required baseline variables:

```text
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_APP_VERSION
DATABASE_URL
STORAGE_DRIVER
LOCAL_STORAGE_PUBLIC_PATH
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_FORCE_PATH_STYLE
```

## Database Documentation

Keep database documentation in sync with `src/server/db/schema.ts`.

```text
docs/DATABASE.md      human-readable schema notes
docs/database.dbml    diagram-friendly DBML schema
```

When schema changes:

- Update `src/server/db/schema.ts`.
- Regenerate migrations with `pnpm db:generate`.
- Rename generated migration files to a clear conventional name when needed.
- Update `docs/DATABASE.md`.
- Update `docs/database.dbml`.
- Use `pnpm db:reset` only for local demo databases.

## Done Criteria

Before finishing a feature:

- The route file stays thin.
- UI copy is not scattered across components.
- API responses follow the documented shape.
- Database work goes through repositories and services.
- Unit/backend tests live under `tests/unit`.
- Browser smoke tests live under `tests/e2e` and are split by feature module.
- `pnpm release:check` passes.
