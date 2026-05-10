import { randomUUID } from "node:crypto";

import { categories, items } from "@/server/db/schema";
import { requireDb } from "@/server/db/client";

const now = new Date();

const categorySeeds = [
  { id: randomUUID(), key: "ayam", name: "Ayam", description: "Produk frozen food berbahan ayam." },
  { id: randomUUID(), key: "sapi", name: "Sapi", description: "Produk frozen food berbahan sapi." },
  { id: randomUUID(), key: "seafood", name: "Seafood", description: "Produk frozen food berbahan hasil laut." },
  { id: randomUUID(), key: "sayuran", name: "Sayuran", description: "Sayuran beku siap olah." },
  { id: randomUUID(), key: "camilan", name: "Camilan", description: "Camilan beku siap goreng." },
];

async function main() {
  const db = requireDb();

  await db
    .insert(categories)
    .values(
      categorySeeds.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing();

  const savedCategories = await db.select({ id: categories.id, name: categories.name }).from(categories);
  const categoryIdByName = new Map(savedCategories.map((category) => [category.name, category.id]));
  const itemSeeds = buildItemSeeds(categoryIdByName);

  await db
    .insert(items)
    .values(itemSeeds.map((item) => ({ ...item, createdAt: now, updatedAt: now })))
    .onConflictDoNothing();

  console.log(`Seeded ${categorySeeds.length} categories and ${itemSeeds.length} items.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function getCategoryId(categoryIdByName: Map<string, string>, name: string): string {
  const categoryId = categoryIdByName.get(name);
  if (!categoryId) throw new Error(`Category "${name}" was not found after seeding categories`);
  return categoryId;
}

function buildItemSeeds(categoryIdByName: Map<string, string>) {
  return [
    {
      id: randomUUID(),
      name: "Ayam nugget crispy",
      categoryId: getCategoryId(categoryIdByName, "Ayam"),
      stock: 120,
      minimumStock: 20,
      unit: "pcs",
      packageSize: "500 gram",
      purchasePrice: 28000,
      sellingPrice: 35000,
      storageLocation: "Freezer A1",
      description: "Nugget ayam crispy kemasan demo.",
    },
    {
      id: randomUUID(),
      name: "Sosis sapi premium",
      categoryId: getCategoryId(categoryIdByName, "Sapi"),
      stock: 15,
      minimumStock: 20,
      unit: "pack",
      packageSize: "10 pcs",
      purchasePrice: 22000,
      sellingPrice: 28000,
      storageLocation: "Freezer B1",
      description: "Sosis sapi premium untuk stok demo.",
    },
    {
      id: randomUUID(),
      name: "Dim sum udang",
      categoryId: getCategoryId(categoryIdByName, "Seafood"),
      stock: 0,
      minimumStock: 20,
      unit: "box",
      packageSize: "20 pcs",
      purchasePrice: 37000,
      sellingPrice: 45000,
      storageLocation: "Freezer C1",
      description: "Dim sum udang dengan status stok habis.",
    },
    {
      id: randomUUID(),
      name: "Bakso urat sapi",
      categoryId: getCategoryId(categoryIdByName, "Sapi"),
      stock: 60,
      minimumStock: 20,
      unit: "pack",
      packageSize: "500 gram",
      purchasePrice: 17000,
      sellingPrice: 22000,
      storageLocation: "Freezer B2",
      description: "Bakso urat sapi kemasan retail.",
    },
    {
      id: randomUUID(),
      name: "Edamame beku",
      categoryId: getCategoryId(categoryIdByName, "Sayuran"),
      stock: 0,
      minimumStock: 20,
      unit: "pack",
      packageSize: "1 kg",
      purchasePrice: 13000,
      sellingPrice: 18000,
      storageLocation: "Freezer D1",
      description: "Edamame beku untuk pelengkap stok demo.",
    },
  ];
}
