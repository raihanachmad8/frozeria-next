import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";

import type { Category, CreateCategoryPayload, DeleteCategoryResult, ListCategoriesParams, UpdateCategoryPayload } from "./types";

const CATEGORY_ENDPOINT = "/api/v1/categories";

function buildCategoryListPath(params?: ListCategoriesParams): string {
  const searchParams = new URLSearchParams();
  const search = params?.q?.trim();

  if (search) {
    searchParams.set("q", search);
  }

  const query = searchParams.toString();
  return query ? `${CATEGORY_ENDPOINT}?${query}` : CATEGORY_ENDPOINT;
}

export function listCategories(params?: ListCategoriesParams): Promise<Category[]> {
  return apiGet<Category[]>(buildCategoryListPath(params));
}

export function getCategory(id: string): Promise<Category> {
  return apiGet<Category>(`${CATEGORY_ENDPOINT}/${id}`);
}

export function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  return apiPost<Category>(CATEGORY_ENDPOINT, payload);
}

export function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
  return apiPut<Category>(`${CATEGORY_ENDPOINT}/${id}`, payload);
}

export function deleteCategory(id: string): Promise<DeleteCategoryResult> {
  return apiDelete<DeleteCategoryResult>(`${CATEGORY_ENDPOINT}/${id}`);
}
