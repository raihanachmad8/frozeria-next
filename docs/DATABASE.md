# Database Schema

Frozeria uses PostgreSQL through Drizzle ORM. The source of truth is `src/server/db/schema.ts`, and the diagram-friendly DBML version is `docs/database.dbml`.

## Tables

### `categories`

Stores frozen-food item categories.

| Column | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | Yes | - | Primary key. |
| `name` | `text` | Yes | - | Unique category name. Must not be empty. |
| `description` | `text` | No | `null` | Optional category description. |
| `created_at` | `timestamptz` | Yes | `now()` | Creation timestamp. |
| `updated_at` | `timestamptz` | Yes | `now()` | Last update timestamp. |

Indexes:

- `categories_name_idx` on `name`

Constraints:

- `categories_name_unique`
- `categories_name_not_empty`

### `items`

Stores frozen-food stock records.

| Column | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | Yes | - | Primary key. |
| `name` | `text` | Yes | - | Unique item name. Must not be empty. |
| `category_id` | `text` | No | `null` | References `categories.id`. Set to `null` when the category is deleted. |
| `stock` | `integer` | Yes | `0` | Current stock amount. Must be non-negative. |
| `minimum_stock` | `integer` | Yes | `20` | Low-stock threshold. Must be non-negative. |
| `unit` | `text` | Yes | - | Stock unit, for example `pcs`, `pack`, `box`, or `kg`. Must not be empty. |
| `package_size` | `text` | No | `null` | Package size or variant, for example `500 gram`, `1 kg`, or `10 pcs`. |
| `purchase_price` | `integer` | Yes | `0` | Purchase price in Rupiah. Must be non-negative. |
| `selling_price` | `integer` | Yes | - | Selling price in Rupiah. Must be non-negative. |
| `photo_url` | `text` | No | `null` | Public photo URL from the configured storage provider. |
| `storage_location` | `text` | No | `null` | Physical storage location, for example `Freezer A1`. |
| `description` | `text` | No | `null` | Optional item description. |
| `created_at` | `timestamptz` | Yes | `now()` | Creation timestamp. |
| `updated_at` | `timestamptz` | Yes | `now()` | Last update timestamp. |

Indexes:

- `items_name_idx` on `name`
- `items_category_id_idx` on `category_id`
- `items_stock_idx` on `stock`

Constraints:

- `items_name_unique`
- `items_name_not_empty`
- `items_unit_not_empty`
- `items_stock_non_negative`
- `items_minimum_stock_non_negative`
- `items_purchase_price_non_negative`
- `items_selling_price_non_negative`

## Relationship

```text
categories.id -> items.category_id
```

Relationship behavior:

- One category can have many items.
- One item can belong to one category.
- `items.category_id` is nullable.
- Deleting a category sets related `items.category_id` to `null`.

## Unit vs Package Size

Use `unit` for the stock counting unit.

Examples:

| Use case | `unit` | `package_size` |
| --- | --- | --- |
| One pack of nuggets weighing 500 gram | `pack` | `500 gram` |
| One box of dim sum containing 20 pieces | `box` | `20 pcs` |
| Single item counted per piece | `pcs` | `null` |
| One bag of vegetables weighing 1 kg | `pack` | `1 kg` |

## Migration

Current baseline migration:

```text
src/server/db/migrations/0000_initial_inventory_schema.sql
```

Commands:

```bash
pnpm db:generate
pnpm db:reset
pnpm db:migrate
pnpm db:seed
```

Use `pnpm db:reset` only for local demo databases. It drops and recreates the `public` and `drizzle` schemas.

Run `pnpm db:migrate` before `pnpm db:seed`.

## Seed Data

The seed script inserts demo categories and items.

```text
scripts/seed.ts
```

Item IDs use `randomUUID()`. Item names are unique, so repeated seed runs will not insert duplicated item names.
