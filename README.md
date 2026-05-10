# Frozeria Next

Frozeria Next is a frozen-food stock management application built for a practical assessment demo.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-1677FF?style=for-the-badge&logo=antdesign&logoColor=white)](https://ant.design/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-C5F74F?style=for-the-badge&logoColor=111111)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## Overview

Frozeria is designed to help store staff manage frozen-food inventory, categories, stock levels, item photos, and item details from a simple web dashboard.

The project follows the assessment brief and targets a stable `v1.0.0` demo release by `2026-05-10`.

## Planned Features

- Dashboard with item table, search, category filter, and pagination.
- Summary cards for total items, total categories, low stock, and out-of-stock items.
- Item detail page with photo, prices, stock, storage location, and description.
- Create, edit, and delete item workflows.
- Category management with create, edit, search, and delete flows.
- Delete confirmation modal for destructive actions.
- Help page with usage guide and participant identity.
- Provider-based photo storage with local development storage and production-ready object storage.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | Ant Design |
| Server state | TanStack Query |
| ORM | Drizzle ORM |
| Database | Neon Postgres |
| Image storage | Driver-based storage: local, Cloudinary, or S3-compatible |
| Deployment | Vercel |
| Package manager | pnpm |

## Project Status

Current version: `v0.9.0`

Target release: `v1.0.0`

Current phase: final hardening and release verification.

## Roadmap

| Version | Target Date | Focus |
| --- | --- | --- |
| `v0.1.0` | `2026-05-08` | Project setup |
| `v0.2.0` | `2026-05-08` | Database foundation |
| `v0.3.0` | `2026-05-09` | Category management |
| `v0.4.0` | `2026-05-09` | Item management |
| `v0.5.0` | `2026-05-09` | Dashboard summary |
| `v0.6.0` | `2026-05-09` | Photo upload |
| `v0.7.0` | `2026-05-10` | Help and demo polish |
| `v0.8.0` | `2026-05-10` | CI and deployment |
| `v0.9.0` | `2026-05-10` | Final hardening |
| `v1.0.0` | `2026-05-10` | Demo release |

Detailed planning:

- [Roadmap](docs/ROADMAP.md)
- [GitHub Milestones](docs/MILESTONES.md)
- [Project Standards](docs/PROJECT_STANDARDS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [PDF Requirements Checklist](docs/PDF_REQUIREMENTS_CHECKLIST.md)
- [Database Schema](docs/DATABASE.md)
- [Database DBML](docs/database.dbml)

## Target Architecture

```text
src/
|-- app/
|-- commons/
|-- components/
|-- features/
|-- lib/
|-- modules/
|-- server/
`-- utils/
```

Layering:

```text
Page -> Feature UI -> Client Module -> API Route -> Service -> Repository -> Database
```

## Branch Flow

```text
feature/* -> dev -> main -> release tag
```

- `dev` is used for active development.
- `main` is used for stable release-ready code.
- Release tags are created from `main`.

## Getting Started

The application scaffold is ready. Use the following flow for local development.

### 1. Clone the Repository

```bash
git clone https://github.com/raihanachmad8/frozeria-next.git
cd frozeria-next
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create `.env.local` from `.env.example` when available.

```env
DATABASE_URL=
STORAGE_DRIVER=local
LOCAL_STORAGE_PUBLIC_PATH=/uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=true
NEXT_PUBLIC_APP_NAME=Frozeria Stok
NEXT_PUBLIC_APP_VERSION=0.9.0
NEXT_PUBLIC_PARTICIPANT_NAME=
NEXT_PUBLIC_PARTICIPANT_STUDENT_ID=
NEXT_PUBLIC_PARTICIPANT_CLASS=
NEXT_PUBLIC_PARTICIPANT_ADDRESS=
NEXT_PUBLIC_PARTICIPANT_PHONE=
NEXT_PUBLIC_PARTICIPANT_EMAIL=
```

Storage drivers:

- `local`: default for local development.
- `cloudinary`: recommended for production/demo deployment.
- `s3`: optional S3-compatible storage for AWS S3, MinIO, Cloudflare R2, or similar providers.

### 4. Run the Development Server

```bash
pnpm dev
```

### 5. Run Quality Checks

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

Test layout:

```text
tests/unit  Vitest unit and backend contract tests
tests/e2e   Playwright browser smoke tests by module
```

Run unit/backend tests:

```bash
pnpm test:unit
```

Run final per-module smoke E2E checks after the demo database is configured and seeded:

```bash
pnpm test:e2e:smoke
```

## Deployment

Deployment uses Vercel Git integration:

- `dev` creates a preview deployment.
- `main` creates the production deployment.
- GitHub Actions runs `pnpm release:check` as the baseline quality gate.
- GitHub Actions runs Playwright smoke E2E checks when the `E2E_DATABASE_URL` repository secret is configured.

See [Deployment Guide](docs/DEPLOYMENT.md) for environment variables, migration steps, health checks, and release checklist.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Achmad Raihan Fahrezi Effendy
