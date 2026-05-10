import { sql } from "drizzle-orm";

import { requireDb } from "@/server/db/client";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to reset the database in production.");
  }

  const db = requireDb();

  await db.execute(sql.raw("drop schema if exists public cascade"));
  await db.execute(sql.raw("drop schema if exists drizzle cascade"));
  await db.execute(sql.raw("create schema public"));

  console.log("Database schemas reset: public, drizzle.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
