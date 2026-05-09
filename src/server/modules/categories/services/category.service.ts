import { randomUUID } from "node:crypto";

import type { Category } from "@/server/db/schema";
import { AppError } from "@/server/http/errors";

import {
  categoryIdSchema,
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  findCategoryRecordById,
  findCategoryRecordByName,
  findCategoryRecordByNameExceptId,
  listCategoryRecords,
  updateCategoryRecord,
} from "../repositories/category.repository";

export interface CategoryDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteCategoryResult {
  id: string;
}

export async function listCategories(input: unknown = {}): Promise<CategoryDto[]> {
  const params = listCategoriesSchema.parse(input);
  const records = await listCategoryRecords(params);
  return records.map(mapCategory);
}

export async function getCategoryById(input: unknown): Promise<CategoryDto> {
  const id = categoryIdSchema.parse(input);
  const record = await findCategoryRecordById(id);
  if (!record) throw new AppError("Category was not found", 404);
  return mapCategory(record);
}

export async function createCategory(input: unknown): Promise<CategoryDto> {
  const payload = createCategorySchema.parse(input);
  const existing = await findCategoryRecordByName(payload.name);
  if (existing) throw new AppError("Category name already exists", 409);

  const now = new Date();
  const record = await createCategoryRecord({
    id: randomUUID(),
    name: payload.name,
    description: payload.description ?? null,
    createdAt: now,
    updatedAt: now,
  });

  return mapCategory(record);
}

export async function updateCategory(idInput: unknown, input: unknown): Promise<CategoryDto> {
  const id = categoryIdSchema.parse(idInput);
  const payload = updateCategorySchema.parse(input);
  const existing = await findCategoryRecordById(id);
  if (!existing) throw new AppError("Category was not found", 404);

  if (payload.name) {
    const duplicate = await findCategoryRecordByNameExceptId(payload.name, id);
    if (duplicate) throw new AppError("Category name already exists", 409);
  }

  const record = await updateCategoryRecord(id, {
    ...payload,
    updatedAt: new Date(),
  });
  if (!record) throw new AppError("Category was not found", 404);

  return mapCategory(record);
}

export async function deleteCategory(idInput: unknown): Promise<DeleteCategoryResult> {
  const id = categoryIdSchema.parse(idInput);
  const record = await deleteCategoryRecord(id);
  if (!record) throw new AppError("Category was not found", 404);
  return { id: record.id };
}

function mapCategory(category: Category): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
