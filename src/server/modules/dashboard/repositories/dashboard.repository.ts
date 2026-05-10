import { count, eq, lt } from "drizzle-orm";

import { categories, items } from "@/server/db/schema";
import { requireDb } from "@/server/db/client";

const LOW_STOCK_THRESHOLD = 20;

async function countRecords(table: typeof items | typeof categories): Promise<number> {
  const db = requireDb();
  const records = await db.select({ value: count() }).from(table);

  return records[0]?.value ?? 0;
}

export async function countDashboardItems(): Promise<number> {
  return countRecords(items);
}

export async function countDashboardCategories(): Promise<number> {
  return countRecords(categories);
}

export async function countDashboardLowStockItems(): Promise<number> {
  const db = requireDb();
  const records = await db.select({ value: count() }).from(items).where(lt(items.stock, LOW_STOCK_THRESHOLD));

  return records[0]?.value ?? 0;
}

export async function countDashboardOutOfStockItems(): Promise<number> {
  const db = requireDb();
  const records = await db.select({ value: count() }).from(items).where(eq(items.stock, 0));

  return records[0]?.value ?? 0;
}
