# PDF Requirements Checklist

Source: `Soal Praktek Pemrograman 2026.pdf`

This checklist maps the BNSP practical-assessment brief to Frozeria implementation and verification evidence.

## Automated Coverage

Run unit/backend checks:

```bash
pnpm test:unit
```

Run browser smoke checks after the demo database is configured and seeded:

```bash
pnpm test:e2e:smoke
```

### Backend and Contract Checks

| Requirement | Verification | Status |
| --- | --- | --- |
| Category validation rejects invalid input | Automated: `tests/unit/server/modules/categories` | [x] |
| Category service handles list/create/update/delete and duplicate names | Automated: `tests/unit/server/modules/categories` | [x] |
| Item validation rejects invalid input and empty update payloads | Automated: `tests/unit/server/modules/items` | [x] |
| Item service handles list/create/update/delete, duplicate names, and missing categories | Automated: `tests/unit/server/modules/items` | [x] |
| Dashboard summary is calculated from repository counts | Automated: `tests/unit/server/modules/dashboard` | [x] |
| API success and error envelopes stay consistent | Automated: `tests/unit/server/http` | [x] |
| API route handlers call the correct services | Automated: `tests/unit/app/api/v1` | [x] |
| Photo upload validates file type and size | Automated: `tests/unit/server/modules/uploads` | [x] |
| Storage driver selection works for local, Cloudinary, and S3 placeholder | Automated: `tests/unit/server/modules/storage` | [x] |
| Local storage writes to the public upload folder | Automated: `tests/unit/server/modules/storage/drivers` | [x] |
| Cloudinary upload handles success and failure responses | Automated: `tests/unit/server/modules/storage/drivers` | [x] |
| Server logger redacts sensitive fields | Automated: `tests/unit/server/logger.test.ts` | [x] |
| Client API wrapper unwraps success envelopes and raises API errors | Automated: `tests/unit/lib/api` | [x] |

### Browser Smoke Checks

| Requirement | Verification | Status |
| --- | --- | --- |
| Dashboard page opens | Automated: `tests/e2e/dashboard.spec.ts` | [x] |
| Dashboard shows item table | Automated: seeded item is visible in dashboard table | [x] |
| Dashboard shows total item card | Automated: `Total barang` is visible | [x] |
| Dashboard shows total category card | Automated: `Total kategori` is visible | [x] |
| Dashboard shows low-stock card | Automated: `Stok menipis` is visible | [x] |
| Dashboard shows out-of-stock card | Automated: `Stok habis` is visible | [x] |
| Search filters items by name | Automated: smoke item is searched by name | [x] |
| Category filter filters items | Automated: smoke category is selected in item filter | [x] |
| Add item button opens item form | Automated: `Tambah Barang` opens `Tambah barang` dialog | [x] |
| Delete item button opens confirmation modal | Automated: `Hapus barang?` dialog appears and is cancelled | [x] |
| Detail button opens item detail page | Automated: item detail page opens for smoke item | [x] |
| Detail page shows item photo area | Automated: placeholder appears when no photo exists | [x] |
| Category page opens | Automated: `tests/e2e/categories.spec.ts` opens `/categories` and validates the heading | [x] |
| Category table shows category data | Automated: smoke category is visible | [x] |
| Category search works | Automated: smoke category is searched by name | [x] |
| Add category button opens category form | Automated: `Tambah Kategori` opens `Tambah kategori` dialog | [x] |
| Delete category button opens confirmation modal | Automated: `Hapus kategori?` dialog appears and is cancelled | [x] |
| Help page opens | Automated: `tests/e2e/help.spec.ts` opens `/help` and validates the heading | [x] |
| Help page shows usage guide | Automated: core guide sections are visible | [x] |
| Help page shows participant identity labels | Automated: required identity labels are visible | [x] |

## Manual Coverage

The following checks require human judgment or production-only credentials. The user has confirmed these manual checks are complete for the current demo state.

| Requirement | Verification | Status |
| --- | --- | --- |
| UI is close enough to the PDF mockups | Manual visual review | [x] |
| Demo data is sensible for assessor review | Manual data review | [x] |
| Production deployment is ready for demo | Manual production smoke check | [x] |
| Participant identity values are correct | Manual environment/value review | [x] |
| Cloudinary photo upload works in production | Manual production upload check | [x] |

## Release Note

Keep this checklist updated if the PDF interpretation changes or if new release blockers are found during final rehearsal.
