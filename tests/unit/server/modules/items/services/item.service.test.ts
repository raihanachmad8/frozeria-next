import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/server/http/errors";
import { findCategoryRecordById } from "@/server/modules/categories/repositories/category.repository";

import {
  countItemRecords,
  createItemRecord,
  deleteItemRecord,
  findItemRecordById,
  findItemRecordByName,
  findItemRecordByNameExceptId,
  listItemRecords,
  updateItemRecord,
} from "@/server/modules/items/repositories/item.repository";
import { createItem, deleteItem, getItemById, listItems, updateItem } from "@/server/modules/items/services/item.service";

vi.mock("@/server/modules/categories/repositories/category.repository", () => ({
  findCategoryRecordById: vi.fn(),
}));

vi.mock("@/server/modules/items/repositories/item.repository", () => ({
  countItemRecords: vi.fn(),
  createItemRecord: vi.fn(),
  deleteItemRecord: vi.fn(),
  findItemRecordById: vi.fn(),
  findItemRecordByName: vi.fn(),
  findItemRecordByNameExceptId: vi.fn(),
  listItemRecords: vi.fn(),
  updateItemRecord: vi.fn(),
}));

const ITEM_ID = "33333333-3333-4333-8333-333333333333";
const OTHER_ITEM_ID = "44444444-4444-4444-8444-444444444444";
const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";
const createdAt = new Date("2026-05-09T01:00:00.000Z");
const updatedAt = new Date("2026-05-09T02:00:00.000Z");

function categoryRecord() {
  return {
    id: CATEGORY_ID,
    name: "Ayam",
    description: "Produk ayam",
    createdAt,
    updatedAt,
  };
}

function itemRecord(overrides = {}) {
  return {
    id: ITEM_ID,
    name: "Ayam nugget",
    categoryId: CATEGORY_ID,
    category: { id: CATEGORY_ID, name: "Ayam" },
    stock: 12,
    minimumStock: 20,
    unit: "pcs",
    packageSize: "500 gram",
    purchasePrice: 12000,
    sellingPrice: 18000,
    photoUrl: null,
    storageLocation: "Freezer A",
    description: "Nugget ayam",
    createdAt,
    updatedAt,
    ...overrides,
  };
}

describe("item service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists items with category and pagination metadata", async () => {
    vi.mocked(listItemRecords).mockResolvedValue([itemRecord()]);
    vi.mocked(countItemRecords).mockResolvedValue(12);

    await expect(listItems({ q: "nugget", page: 2, pageSize: 10 })).resolves.toMatchObject({
      items: [
        {
          id: ITEM_ID,
          name: "Ayam nugget",
          category: { id: CATEGORY_ID, name: "Ayam" },
          createdAt: createdAt.toISOString(),
        },
      ],
      pagination: {
        current_page: 2,
        per_page: 10,
        total_pages: 2,
        total_items: 12,
        has_next_page: false,
        has_prev_page: true,
      },
    });
  });

  it("creates an item when category exists and name is unique", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(categoryRecord());
    vi.mocked(findItemRecordByName).mockResolvedValue(null);
    vi.mocked(createItemRecord).mockResolvedValue(itemRecord());
    vi.mocked(findItemRecordById).mockResolvedValue(itemRecord());

    const result = await createItem({
      name: "Ayam nugget",
      categoryId: CATEGORY_ID,
      stock: 12,
      unit: "pcs",
      sellingPrice: 18000,
    });

    expect(result).toMatchObject({
      id: ITEM_ID,
      name: "Ayam nugget",
      categoryId: CATEGORY_ID,
      minimumStock: 20,
    });
    expect(createItemRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: CATEGORY_ID,
        purchasePrice: 0,
        packageSize: null,
        photoUrl: null,
        storageLocation: null,
        description: null,
      }),
    );
  });

  it("rejects missing categories on create", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(null);

    await expect(
      createItem({
        name: "Ayam nugget",
        categoryId: CATEGORY_ID,
        stock: 12,
        unit: "pcs",
        sellingPrice: 18000,
      }),
    ).rejects.toMatchObject({
      status: 404,
      code: "CATEGORY_NOT_FOUND",
    } satisfies Partial<AppError>);
  });

  it("rejects duplicate item names on create", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(categoryRecord());
    vi.mocked(findItemRecordByName).mockResolvedValue(itemRecord());

    await expect(
      createItem({
        name: "Ayam nugget",
        categoryId: CATEGORY_ID,
        stock: 12,
        unit: "pcs",
        sellingPrice: 18000,
      }),
    ).rejects.toMatchObject({ status: 409, code: "ITEM_NAME_EXISTS" });
  });

  it("updates an item after validating duplicate names and categories", async () => {
    vi.mocked(findItemRecordById)
      .mockResolvedValueOnce(itemRecord())
      .mockResolvedValueOnce(itemRecord({ name: "Sosis sapi" }));
    vi.mocked(findCategoryRecordById).mockResolvedValue(categoryRecord());
    vi.mocked(findItemRecordByNameExceptId).mockResolvedValue(null);
    vi.mocked(updateItemRecord).mockResolvedValue(itemRecord({ name: "Sosis sapi" }));

    await expect(updateItem(ITEM_ID, { name: "Sosis sapi", categoryId: CATEGORY_ID })).resolves.toMatchObject({
      id: ITEM_ID,
      name: "Sosis sapi",
    });
    expect(findItemRecordByNameExceptId).toHaveBeenCalledWith("Sosis sapi", ITEM_ID);
  });

  it("rejects duplicate item names on update", async () => {
    vi.mocked(findItemRecordById).mockResolvedValue(itemRecord());
    vi.mocked(findItemRecordByNameExceptId).mockResolvedValue(itemRecord({ id: OTHER_ITEM_ID }));

    await expect(updateItem(ITEM_ID, { name: "Sosis sapi" })).rejects.toMatchObject({
      status: 409,
      code: "ITEM_NAME_EXISTS",
    });
  });

  it("returns not found for missing item lookups and deletes", async () => {
    vi.mocked(findItemRecordById).mockResolvedValue(null);
    vi.mocked(deleteItemRecord).mockResolvedValue(null);

    await expect(getItemById(ITEM_ID)).rejects.toMatchObject({ status: 404, code: "ITEM_NOT_FOUND" });
    await expect(deleteItem(ITEM_ID)).rejects.toMatchObject({ status: 404, code: "ITEM_NOT_FOUND" });
  });

  it("deletes an item by id", async () => {
    vi.mocked(deleteItemRecord).mockResolvedValue(itemRecord());

    await expect(deleteItem(ITEM_ID)).resolves.toEqual({ id: ITEM_ID });
  });
});
