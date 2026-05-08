# Conventions

## Naming

Use English for filenames, folders, functions, variables, types, and internal documentation.

Use Indonesian only for user-facing UI text when it improves the demo experience.

```text
Good:
category-page.tsx
item-form.tsx
delete-item-modal.tsx
sellingPrice
minimumStock

Avoid:
halaman-kategori.tsx
form-barang.tsx
modal-hapus-barang.tsx
hargaJual
stokMinimum
```

## File Names

Use kebab-case for files and folders.

```text
app-shell.tsx
query-provider.tsx
category-table.tsx
item-detail.tsx
```

Use PascalCase for React components.

```ts
export function CategoryPage() {}
export function ItemForm() {}
```

Use camelCase for values and functions.

```ts
const minimumStock = 20;
function formatRupiah() {}
```

Use PascalCase for types and interfaces.

```ts
interface ItemListParams {}
type CategoryOption = {}
```

## Constants

Avoid magic text and magic numbers in page components.

Feature-level constants live beside the feature.

```text
src/features/dashboard/constants.ts
src/features/categories/constants.ts
src/features/items/constants.ts
src/features/help/constants.ts
```

Shared constants live in `src/commons/constants`.

```text
src/commons/constants/app.ts
src/commons/constants/navigation.ts
src/commons/constants/routes.ts
```

## API

All application API routes use `/api/v1`.

Response shapes:

```ts
{ data: value }
{ data: values, meta: { page, pageSize, total, pageCount } }
{ error: message }
```

## State Management

Use:

- TanStack Query for server state.
- Ant Design Form for form state.
- URL query string for search, filters, and pagination.
- Local `useState` for modal and upload preview state.

Do not add Redux or Zustand unless the project requirements change.

## Checks

Run this before handoff:

```bash
pnpm release:check
```
