import { and, asc, eq, ilike, ne } from "drizzle-orm";

import { categories, type Category, type NewCategory } from "@/server/db/schema";
import { requireDb } from "@/server/db/client";

export interface ListCategoriesParams {
  q?: string;
}

export interface UpdateCategoryRecord {
  name?: string;
  description?: string | null;
  updatedAt: Date;
}

export async function listCategoryRecords(params: ListCategoriesParams = {}): Promise<Category[]> {
  const db = requireDb();

  return db
    .select()
    .from(categories)
    .where(params.q ? ilike(categories.name, `%${params.q}%`) : undefined)
    .orderBy(asc(categories.name));
}

export async function findCategoryRecordById(id: string): Promise<Category | null> {
  const db = requireDb();
  const records = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return records[0] ?? null;
}

export async function findCategoryRecordByName(name: string): Promise<Category | null> {
  const db = requireDb();
  const records = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
  return records[0] ?? null;
}

export async function findCategoryRecordByNameExceptId(name: string, id: string): Promise<Category | null> {
  const db = requireDb();
  const records = await db
    .select()
    .from(categories)
    .where(and(eq(categories.name, name), ne(categories.id, id)))
    .limit(1);
  return records[0] ?? null;
}

export async function createCategoryRecord(record: NewCategory): Promise<Category> {
  const db = requireDb();
  const records = await db.insert(categories).values(record).returning();
  return records[0];
}

export async function updateCategoryRecord(id: string, record: UpdateCategoryRecord): Promise<Category | null> {
  const db = requireDb();
  const records = await db.update(categories).set(record).where(eq(categories.id, id)).returning();
  return records[0] ?? null;
}

export async function deleteCategoryRecord(id: string): Promise<Category | null> {
  const db = requireDb();
  const records = await db.delete(categories).where(eq(categories.id, id)).returning();
  return records[0] ?? null;
}
