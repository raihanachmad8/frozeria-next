import { relations, sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("categories_name_idx").on(table.name),
    check("categories_name_not_empty", sql`length(trim(${table.name})) > 0`),
  ],
);

export const items = pgTable(
  "items",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
    stock: integer("stock").notNull().default(0),
    minimumStock: integer("minimum_stock").notNull().default(20),
    unit: text("unit").notNull(),
    packageSize: text("package_size"),
    purchasePrice: integer("purchase_price").notNull().default(0),
    sellingPrice: integer("selling_price").notNull(),
    photoUrl: text("photo_url"),
    storageLocation: text("storage_location"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("items_name_idx").on(table.name),
    index("items_category_id_idx").on(table.categoryId),
    index("items_stock_idx").on(table.stock),
    check("items_name_not_empty", sql`length(trim(${table.name})) > 0`),
    check("items_unit_not_empty", sql`length(trim(${table.unit})) > 0`),
    check("items_stock_non_negative", sql`${table.stock} >= 0`),
    check("items_minimum_stock_non_negative", sql`${table.minimumStock} >= 0`),
    check("items_purchase_price_non_negative", sql`${table.purchasePrice} >= 0`),
    check("items_selling_price_non_negative", sql`${table.sellingPrice} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
