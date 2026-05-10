import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/server/env";

import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

const REQUIRED_TABLES = ["categories", "items"] as const;

const globalForDb = globalThis as unknown as {
  frozeriaPool?: Pool;
  frozeriaDb?: Db;
};

export function hasDatabase(): boolean {
  return Boolean(env.DATABASE_URL);
}

export function getDb(): Db | null {
  if (!env.DATABASE_URL) return null;

  if (!globalForDb.frozeriaPool) {
    globalForDb.frozeriaPool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 5,
    });
  }

  if (!globalForDb.frozeriaDb) {
    globalForDb.frozeriaDb = drizzle(globalForDb.frozeriaPool, { schema });
  }

  return globalForDb.frozeriaDb;
}

export function requireDb(): Db {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}

export async function checkDatabase(): Promise<{ configured: boolean; ok: boolean; error?: string }> {
  if (!env.DATABASE_URL) {
    return { configured: false, ok: false, error: "DATABASE_URL is not configured" };
  }

  try {
    const pool = globalForDb.frozeriaPool ?? new Pool({ connectionString: env.DATABASE_URL, max: 1 });
    if (!globalForDb.frozeriaPool) globalForDb.frozeriaPool = pool;
    await pool.query("select 1");
    return { configured: true, ok: true };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      error: error instanceof Error ? error.message : "Database check failed",
    };
  }
}

export async function checkDatabaseSchema(): Promise<{
  ok: boolean;
  requiredTables: string[];
  missingTables: string[];
  error?: string;
}> {
  if (!env.DATABASE_URL) {
    return {
      ok: false,
      requiredTables: [...REQUIRED_TABLES],
      missingTables: [...REQUIRED_TABLES],
      error: "DATABASE_URL is not configured",
    };
  }

  try {
    const pool = globalForDb.frozeriaPool ?? new Pool({ connectionString: env.DATABASE_URL, max: 1 });
    if (!globalForDb.frozeriaPool) globalForDb.frozeriaPool = pool;

    const missingTables: string[] = [];
    for (const table of REQUIRED_TABLES) {
      const result = await pool.query<{ exists: string | null }>("select to_regclass($1) as exists", [
        `public.${table}`,
      ]);
      if (!result.rows[0]?.exists) missingTables.push(table);
    }

    return { ok: missingTables.length === 0, requiredTables: [...REQUIRED_TABLES], missingTables };
  } catch (error) {
    return {
      ok: false,
      requiredTables: [...REQUIRED_TABLES],
      missingTables: [...REQUIRED_TABLES],
      error: error instanceof Error ? error.message : "Database schema check failed",
    };
  }
}
