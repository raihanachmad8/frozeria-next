import { and, asc, count, desc, eq, ilike, ne, or, type SQL } from "drizzle-orm";

import { categories, items, type Item, type NewItem } from "@/server/db/schema";
import { requireDb } from "@/server/db/client";

import type { ListItemsInput } from "../schemas/item.schema";

export interface ItemCategoryRecord {
  id: string | null;
  name: string | null;
}

export interface ItemWithCategoryRecord extends Item {
  category: ItemCategoryRecord | null;
}

export interface UpdateItemRecord {
  name?: string;
  categoryId?: string | null;
  stock?: number;
  minimumStock?: number;
  unit?: string;
  packageSize?: string | null;
  purchasePrice?: number;
  sellingPrice?: number;
  photoUrl?: string | null;
  storageLocation?: string | null;
  description?: string | null;
  updatedAt: Date;
}

function buildListWhere(params: Pick<ListItemsInput, "q" | "categoryId">): SQL | undefined {
  const conditions: SQL[] = [];

  if (params.q) {
    conditions.push(or(ilike(items.name, `%${params.q}%`), ilike(items.description, `%${params.q}%`))!);
  }

  if (params.categoryId) {
    conditions.push(eq(items.categoryId, params.categoryId));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function buildOrder(params: Pick<ListItemsInput, "sortBy" | "sortDirection">) {
  const column = {
    createdAt: items.createdAt,
    name: items.name,
    sellingPrice: items.sellingPrice,
    stock: items.stock,
  }[params.sortBy];

  return params.sortDirection === "desc" ? desc(column) : asc(column);
}

function mapJoinedRecord(record: { item: Item; categoryId: string | null; categoryName: string | null }): ItemWithCategoryRecord {
  return {
    ...record.item,
    category: record.categoryId && record.categoryName ? { id: record.categoryId, name: record.categoryName } : null,
  };
}

export async function listItemRecords(params: ListItemsInput): Promise<ItemWithCategoryRecord[]> {
  const db = requireDb();
  const where = buildListWhere(params);
  const offset = (params.page - 1) * params.pageSize;
  const records = await db
    .select({
      item: items,
      categoryId: categories.id,
      categoryName: categories.name,
    })
    .from(items)
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .where(where)
    .orderBy(buildOrder(params))
    .limit(params.pageSize)
    .offset(offset);

  return records.map(mapJoinedRecord);
}

export async function countItemRecords(params: Pick<ListItemsInput, "q" | "categoryId">): Promise<number> {
  const db = requireDb();
  const records = await db.select({ value: count() }).from(items).where(buildListWhere(params));
  return records[0]?.value ?? 0;
}

export async function findItemRecordById(id: string): Promise<ItemWithCategoryRecord | null> {
  const db = requireDb();
  const records = await db
    .select({
      item: items,
      categoryId: categories.id,
      categoryName: categories.name,
    })
    .from(items)
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(items.id, id))
    .limit(1);

  return records[0] ? mapJoinedRecord(records[0]) : null;
}

export async function findItemRecordByName(name: string): Promise<Item | null> {
  const db = requireDb();
  const records = await db.select().from(items).where(eq(items.name, name)).limit(1);
  return records[0] ?? null;
}

export async function findItemRecordByNameExceptId(name: string, id: string): Promise<Item | null> {
  const db = requireDb();
  const records = await db.select().from(items).where(and(eq(items.name, name), ne(items.id, id))).limit(1);
  return records[0] ?? null;
}

export async function createItemRecord(record: NewItem): Promise<Item> {
  const db = requireDb();
  const records = await db.insert(items).values(record).returning();
  return records[0];
}

export async function updateItemRecord(id: string, record: UpdateItemRecord): Promise<Item | null> {
  const db = requireDb();
  const records = await db.update(items).set(record).where(eq(items.id, id)).returning();
  return records[0] ?? null;
}

export async function deleteItemRecord(id: string): Promise<Item | null> {
  const db = requireDb();
  const records = await db.delete(items).where(eq(items.id, id)).returning();
  return records[0] ?? null;
}
