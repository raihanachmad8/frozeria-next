import { randomUUID } from "node:crypto";

import type { ApiPaginationMeta } from "@/commons/types";
import type { Item } from "@/server/db/schema";
import { AppError } from "@/server/http/errors";
import { findCategoryRecordById } from "@/server/modules/categories/repositories/category.repository";

import {
  createItemRecord,
  deleteItemRecord,
  findItemRecordById,
  findItemRecordByName,
  findItemRecordByNameExceptId,
  listItemRecords,
  countItemRecords,
  updateItemRecord,
  type ItemWithCategoryRecord,
} from "../repositories/item.repository";
import { createItemSchema, itemIdSchema, listItemsSchema, updateItemSchema } from "../schemas/item.schema";

export interface ItemCategoryDto {
  id: string;
  name: string;
}

export interface ItemDto {
  id: string;
  name: string;
  categoryId: string | null;
  category: ItemCategoryDto | null;
  stock: number;
  minimumStock: number;
  unit: string;
  packageSize: string | null;
  purchasePrice: number;
  sellingPrice: number;
  photoUrl: string | null;
  storageLocation: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListItemsResult {
  items: ItemDto[];
  pagination: ApiPaginationMeta;
}

export interface DeleteItemResult {
  id: string;
}

export async function listItems(input: unknown = {}): Promise<ListItemsResult> {
  const params = listItemsSchema.parse(input);
  const [records, total] = await Promise.all([listItemRecords(params), countItemRecords(params)]);
  const totalPages = Math.ceil(total / params.pageSize);

  return {
    items: records.map(mapItemWithCategory),
    pagination: {
      current_page: params.page,
      per_page: params.pageSize,
      total_pages: totalPages,
      total_items: total,
      has_next_page: params.page < totalPages,
      has_prev_page: params.page > 1,
    },
  };
}

export async function getItemById(input: unknown): Promise<ItemDto> {
  const id = itemIdSchema.parse(input);
  const record = await findItemRecordById(id);
  if (!record) throw new AppError("Item was not found", 404, "ITEM_NOT_FOUND");
  return mapItemWithCategory(record);
}

export async function createItem(input: unknown): Promise<ItemDto> {
  const payload = createItemSchema.parse(input);
  await assertCategoryExists(payload.categoryId);

  const duplicate = await findItemRecordByName(payload.name);
  if (duplicate) throw new AppError("Item name already exists", 409, "ITEM_NAME_EXISTS");

  const now = new Date();
  const record = await createItemRecord({
    id: randomUUID(),
    ...payload,
    categoryId: payload.categoryId ?? null,
    packageSize: payload.packageSize ?? null,
    photoUrl: payload.photoUrl ?? null,
    storageLocation: payload.storageLocation ?? null,
    description: payload.description ?? null,
    createdAt: now,
    updatedAt: now,
  });

  return getItemById(record.id);
}

export async function updateItem(idInput: unknown, input: unknown): Promise<ItemDto> {
  const id = itemIdSchema.parse(idInput);
  const payload = updateItemSchema.parse(input);
  const existing = await findItemRecordById(id);
  if (!existing) throw new AppError("Item was not found", 404, "ITEM_NOT_FOUND");

  if (payload.categoryId !== undefined) {
    await assertCategoryExists(payload.categoryId);
  }

  if (payload.name) {
    const duplicate = await findItemRecordByNameExceptId(payload.name, id);
    if (duplicate) throw new AppError("Item name already exists", 409, "ITEM_NAME_EXISTS");
  }

  const record = await updateItemRecord(id, {
    ...payload,
    updatedAt: new Date(),
  });
  if (!record) throw new AppError("Item was not found", 404, "ITEM_NOT_FOUND");

  return getItemById(record.id);
}

export async function deleteItem(idInput: unknown): Promise<DeleteItemResult> {
  const id = itemIdSchema.parse(idInput);
  const record = await deleteItemRecord(id);
  if (!record) throw new AppError("Item was not found", 404, "ITEM_NOT_FOUND");
  return { id: record.id };
}

async function assertCategoryExists(categoryId: string | null | undefined): Promise<void> {
  if (!categoryId) return;

  const category = await findCategoryRecordById(categoryId);
  if (!category) throw new AppError("Category was not found", 404, "CATEGORY_NOT_FOUND");
}

function mapItemWithCategory(item: ItemWithCategoryRecord): ItemDto {
  return {
    ...mapItem(item),
    category: item.category?.id && item.category.name ? { id: item.category.id, name: item.category.name } : null,
  };
}

function mapItem(item: Item): Omit<ItemDto, "category"> {
  return {
    id: item.id,
    name: item.name,
    categoryId: item.categoryId,
    stock: item.stock,
    minimumStock: item.minimumStock,
    unit: item.unit,
    packageSize: item.packageSize,
    purchasePrice: item.purchasePrice,
    sellingPrice: item.sellingPrice,
    photoUrl: item.photoUrl,
    storageLocation: item.storageLocation,
    description: item.description,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
