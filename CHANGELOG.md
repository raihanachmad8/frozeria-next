# Changelog

## v1.0.0 - Demo Release

Release target: 2026-05-10

### Added

- Dashboard inventory list with item search, category filter, pagination, and summary cards.
- Item management for create, edit, detail, delete, stock, prices, units, package size, storage location, description, and photo.
- Category management for create, edit, search, and delete.
- Delete confirmation modal for destructive item and category actions.
- Item photo upload with driver-based storage for local development, Cloudinary, and S3-compatible providers.
- Help page with usage guide and participant identity from environment variables.
- Standard API envelope for success, error, and paginated responses.
- Drizzle schema, migrations, seed data, database documentation, and DBML.
- GitHub Actions quality gate and optional Playwright E2E smoke checks.
- Unit/backend tests and per-module Playwright smoke tests.

### Changed

- Promoted the application version from `0.9.0` to `1.0.0`.
- Finalized release documentation for roadmap, milestones, deployment, and PDF requirement verification.
- Kept deployment on Vercel Git integration with `main` as the production branch.

### Verified

- Dashboard, item, category, detail, delete confirmation, upload, and help flows match the assessment scope.
- Data persists through the configured PostgreSQL database.
- `pnpm release:check` passes.
- `pnpm test:e2e:smoke` passes against the configured demo environment.
