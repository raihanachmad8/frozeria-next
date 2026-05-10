import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/server/http/errors";
import type { Category } from "@/server/db/schema";

import {
  countCategoryRecords,
  createCategoryRecord,
  deleteCategoryRecord,
  findCategoryRecordById,
  findCategoryRecordByName,
  findCategoryRecordByNameExceptId,
  listCategoryRecords,
  updateCategoryRecord,
} from "@/server/modules/categories/repositories/category.repository";
import { createCategory, deleteCategory, getCategoryById, listCategories, updateCategory } from "@/server/modules/categories/services/category.service";

vi.mock("@/server/modules/categories/repositories/category.repository", () => ({
  countCategoryRecords: vi.fn(),
  createCategoryRecord: vi.fn(),
  deleteCategoryRecord: vi.fn(),
  findCategoryRecordById: vi.fn(),
  findCategoryRecordByName: vi.fn(),
  findCategoryRecordByNameExceptId: vi.fn(),
  listCategoryRecords: vi.fn(),
  updateCategoryRecord: vi.fn(),
}));

const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";
const OTHER_CATEGORY_ID = "22222222-2222-4222-8222-222222222222";
const createdAt = new Date("2026-05-09T01:00:00.000Z");
const updatedAt = new Date("2026-05-09T02:00:00.000Z");

function categoryRecord(overrides: Partial<Category> = {}): Category {
  return {
    id: CATEGORY_ID,
    name: "Ayam",
    description: "Produk ayam beku",
    createdAt,
    updatedAt,
    ...overrides,
  };
}

describe("category service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists categories with pagination metadata", async () => {
    vi.mocked(listCategoryRecords).mockResolvedValue([categoryRecord()]);
    vi.mocked(countCategoryRecords).mockResolvedValue(11);

    await expect(listCategories({ q: "ayam", page: 2, pageSize: 10 })).resolves.toEqual({
      categories: [
        {
          id: CATEGORY_ID,
          name: "Ayam",
          description: "Produk ayam beku",
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      ],
      pagination: {
        current_page: 2,
        per_page: 10,
        total_pages: 2,
        total_items: 11,
        has_next_page: false,
        has_prev_page: true,
      },
    });
    expect(listCategoryRecords).toHaveBeenCalledWith(expect.objectContaining({ q: "ayam", page: 2, pageSize: 10 }));
  });

  it("creates a category when the name is unique", async () => {
    vi.mocked(findCategoryRecordByName).mockResolvedValue(null);
    vi.mocked(createCategoryRecord).mockImplementation(async (record) => categoryRecord({ ...record, id: CATEGORY_ID }));

    const result = await createCategory({ name: " Ayam ", description: "" });

    expect(result).toMatchObject({
      id: CATEGORY_ID,
      name: "Ayam",
      description: null,
    });
    expect(createCategoryRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ayam",
        description: null,
      }),
    );
  });

  it("rejects duplicate category names on create", async () => {
    vi.mocked(findCategoryRecordByName).mockResolvedValue(categoryRecord());

    await expect(createCategory({ name: "Ayam" })).rejects.toMatchObject({
      status: 409,
      code: "CATEGORY_NAME_EXISTS",
    } satisfies Partial<AppError>);
  });

  it("updates a category after duplicate checks", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(categoryRecord());
    vi.mocked(findCategoryRecordByNameExceptId).mockResolvedValue(null);
    vi.mocked(updateCategoryRecord).mockResolvedValue(categoryRecord({ name: "Sapi", description: null }));

    await expect(updateCategory(CATEGORY_ID, { name: "Sapi", description: " " })).resolves.toMatchObject({
      id: CATEGORY_ID,
      name: "Sapi",
      description: null,
    });
    expect(findCategoryRecordByNameExceptId).toHaveBeenCalledWith("Sapi", CATEGORY_ID);
  });

  it("rejects duplicate category names on update", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(categoryRecord());
    vi.mocked(findCategoryRecordByNameExceptId).mockResolvedValue(categoryRecord({ id: OTHER_CATEGORY_ID }));

    await expect(updateCategory(CATEGORY_ID, { name: "Sapi" })).rejects.toMatchObject({
      status: 409,
      code: "CATEGORY_NAME_EXISTS",
    } satisfies Partial<AppError>);
  });

  it("returns not found for missing category lookups and deletes", async () => {
    vi.mocked(findCategoryRecordById).mockResolvedValue(null);
    vi.mocked(deleteCategoryRecord).mockResolvedValue(null);

    await expect(getCategoryById(CATEGORY_ID)).rejects.toMatchObject({ status: 404, code: "CATEGORY_NOT_FOUND" });
    await expect(deleteCategory(CATEGORY_ID)).rejects.toMatchObject({ status: 404, code: "CATEGORY_NOT_FOUND" });
  });

  it("deletes a category by id", async () => {
    vi.mocked(deleteCategoryRecord).mockResolvedValue(categoryRecord());

    await expect(deleteCategory(CATEGORY_ID)).resolves.toEqual({ id: CATEGORY_ID });
  });
});
