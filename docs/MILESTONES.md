# GitHub Milestones

Use this file as a copy-paste source for GitHub milestone creation.

GitHub fields:

```text
Title
Due date (optional)
Description (optional)
```

Target schedule: current project version is `v0.0.0`, and the final `v1.0.0` demo release must be ready no later than May 10, 2026.

## Milestone 1

Title:

```text
v0.1.0 - Project Setup
```

Due date:

```text
2026-05-08
```

Description:

```text
Set up the Frozeria Next repository and application foundation.

Scope:
- Initialize the Next.js App Router project with TypeScript.
- Configure pnpm, ESLint, TypeScript, and base scripts.
- Install and configure Ant Design.
- Add the agreed folder structure.
- Add base documentation, README, and contribution notes.
- Prepare main and dev branch workflow.

Done when:
- The app can run locally.
- The repository has the expected base files and docs.
- The base layout and navigation plan are ready for feature work.
```

## Milestone 2

Title:

```text
v0.2.0 - Database Foundation
```

Due date:

```text
2026-05-08
```

Description:

```text
Set up the database layer and initial data model for Frozeria inventory.

Scope:
- Configure Neon Postgres connection.
- Install and configure Drizzle ORM.
- Create categories schema.
- Create items schema.
- Add relation between items and categories.
- Generate the initial migration.
- Add seed data for demo-ready categories and items.
- Add basic database health checks.

Done when:
- The app can connect to the database.
- Migrations can run successfully.
- Seed data can be inserted.
- Items and categories tables are ready for CRUD features.
```

## Milestone 3

Title:

```text
v0.3.0 - Category Management
```

Due date:

```text
2026-05-09
```

Description:

```text
Build complete category management for frozen-food item grouping.

Scope:
- Create category list page.
- Add category search.
- Add create category form.
- Add edit category form.
- Add delete category flow.
- Add delete confirmation modal.
- Keep items safe when a category is deleted by clearing their category reference.

Done when:
- Users can create, view, update, and delete categories.
- Category search works.
- Category deletion is confirmed through a modal.
- Item records are not deleted when a category is removed.
```

## Milestone 4

Title:

```text
v0.4.0 - Item Management
```

Due date:

```text
2026-05-09
```

Description:

```text
Build the main inventory workflow for Frozeria items.

Scope:
- Create dashboard item table.
- Add item search by name.
- Add item filter by category.
- Add create item form.
- Add edit item form.
- Add item detail page.
- Add delete item flow.
- Add delete confirmation modal.
- Add required form validation.
- Add Rupiah price formatting.

Done when:
- Users can create, view, update, and delete items.
- Search and category filter work from the dashboard.
- Item detail displays the required inventory information.
- Delete action removes data from both UI and database after confirmation.
```

## Milestone 5

Title:

```text
v0.5.0 - Dashboard Summary
```

Due date:

```text
2026-05-09
```

Description:

```text
Complete the dashboard summary and stock visibility features required by the BNSP brief.

Scope:
- Add total items card.
- Add total categories card.
- Add low stock card for items with stock lower than 20.
- Add out-of-stock card for items with stock equal to 0.
- Calculate summary values from the database.
- Add stock status labels or tags.
- Improve dashboard table spacing and readability.

Done when:
- Dashboard cards show correct database-backed counts.
- Low stock and out-of-stock rules match the assessment requirement.
- Dashboard is ready for repeated demo use.
```

## Milestone 6

Title:

```text
v0.6.0 - Photo Upload
```

Due date:

```text
2026-05-09
```

Description:

```text
Add item photo upload and display support with driver-based storage.

Scope:
- Configure driver-based storage.
- Add local storage driver for development.
- Add Cloudinary storage driver for production/demo deployment.
- Add optional S3-compatible storage driver for AWS S3, MinIO, Cloudflare R2, or similar providers.
- Add item photo upload endpoint.
- Validate uploaded image type and size.
- Store only the uploaded photo URL in the database.
- Show item photo on the detail page.
- Show a placeholder when an item has no photo.

Done when:
- Users can upload an item photo from the item form.
- Uploaded photos appear on item detail.
- Local development can use the local storage driver.
- Production deployment can use Cloudinary or an S3-compatible storage driver.
```

## Milestone 7

Title:

```text
v0.7.0 - Help and Demo Polish
```

Due date:

```text
2026-05-10
```

Description:

```text
Finish the help page and polish the application for assessor demo flow.

Scope:
- Create help page.
- Add guide for adding a new item.
- Add guide for updating incoming stock.
- Add guide for managing categories.
- Add participant identity section: name, student ID, class, address, phone number, and email.
- Polish form copy, empty states, validation messages, and responsive layout.

Done when:
- The help page contains all required instructions.
- Participant identity is visible at the bottom of the help page.
- Core screens are clean enough for BNSP demo.
```

## Milestone 8

Title:

```text
v0.8.0 - CI and Deployment
```

Due date:

```text
2026-05-10
```

Description:

```text
Prepare automated verification and free deployment flow.

Scope:
- Add GitHub Actions CI workflow.
- Run lint, type-check, tests, and build in CI.
- Connect repository to Vercel.
- Configure Vercel environment variables.
- Configure Neon Postgres for production.
- Configure the production storage driver for uploads.
- Verify preview and production deployments.

Done when:
- CI runs successfully on pull requests and branch pushes.
- Vercel deployment succeeds from main.
- Required production environment variables are configured.
```

## Milestone 9

Title:

```text
v1.0.0 - BNSP Demo Release
```

Due date:

```text
2026-05-10
```

Description:

```text
Finalize the stable release for the BNSP practical assessment demo.

Scope:
- Verify every requirement from the PDF brief.
- Test the full demo flow end to end.
- Fix final UI, validation, and data issues.
- Update README and setup documentation.
- Merge dev into main through pull request.
- Create release tag v1.0.0.
- Prepare GitHub release notes with demo summary.

Done when:
- All required BNSP features are complete.
- The production deployment can be opened and demonstrated.
- The app works without a local server.
- The v1.0.0 tag exists on main.
```
