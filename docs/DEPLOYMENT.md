# Deployment

Frozeria uses Vercel Git integration for deployment. GitHub Actions is used only as a quality gate, not as the deployment runner.

## Target Platform

| Area | Provider |
| --- | --- |
| Application hosting | Vercel Hobby |
| Database | Neon Postgres Free |
| Image storage | Cloudinary Free |
| Source control | GitHub |

## Branch Mapping

| Git branch | Vercel behavior | Purpose |
| --- | --- | --- |
| `feature/*` | Pull request preview | Feature validation |
| `dev` | Preview deployment | Integrated demo testing |
| `main` | Production deployment | Stable release |

Set the Vercel production branch to `main`.

## Vercel Project Setup

1. Import the GitHub repository into Vercel.
2. Select the `frozeria-next` project root.
3. Use the default Next.js framework preset.
4. Set the production branch to `main`.
5. Add the required environment variables.
6. Deploy once from `dev` for preview validation.
7. Merge `dev` into `main` only after checks and manual demo validation pass.

## Environment Variables

Add these variables in Vercel Project Settings. Use different values for Preview and Production when needed.

```env
NEXT_PUBLIC_APP_NAME=Frozeria Stok
NEXT_PUBLIC_APP_VERSION=1.0.0

NEXT_PUBLIC_PARTICIPANT_NAME=
NEXT_PUBLIC_PARTICIPANT_STUDENT_ID=
NEXT_PUBLIC_PARTICIPANT_CLASS=
NEXT_PUBLIC_PARTICIPANT_ADDRESS=
NEXT_PUBLIC_PARTICIPANT_PHONE=
NEXT_PUBLIC_PARTICIPANT_EMAIL=

DATABASE_URL=

STORAGE_DRIVER=cloudinary
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
```

Do not store real values in `.env.example`, README, issues, pull requests, or build logs.

## GitHub Actions

CI is a quality gate only. Deployment is handled by Vercel Git integration.

Current checks:

- `Quality checks`: installs dependencies and runs `pnpm release:check`.
- `E2E smoke checks`: runs Playwright browser smoke tests when the repository secret `E2E_DATABASE_URL` is configured.

Use a separate Neon test database URL for `E2E_DATABASE_URL`. Do not point this secret to the production database. The E2E job runs migrations before testing because the browser smoke tests create temporary category and item data through the API.

## Database Migration

Run migrations manually before a demo release:

```bash
pnpm db:migrate
pnpm db:seed
```

Do not run migrations automatically on every Vercel preview build when preview and production share the same database.

## Health Checks

After deployment, open these endpoints:

```text
/api/v1/health/live
/api/v1/health/ready
```

Expected result:

- Live check returns a successful API envelope.
- Ready check confirms whether the database connection is configured and reachable.

## Release Checklist

- GitHub Actions CI passes on the pull request.
- Vercel preview deployment from `dev` opens successfully.
- Dashboard loads item data from the target database.
- Search and category filter work.
- Item create, edit, detail, delete, and photo upload work.
- Category create, edit, and delete work.
- Help page displays participant identity from Vercel environment variables.
- `pnpm test:e2e:smoke` passes against the configured demo environment.
- Ready health check is successful.
- `main` deployment is opened and smoke-tested after merge.

## Rollback

Use Vercel's deployment history to promote the previous working deployment if production breaks after release. If database data was changed during the failed release, verify whether a manual data correction is needed before re-promoting.
