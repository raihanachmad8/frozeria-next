import { apiDelete, apiGet, apiGetEnvelope, apiPost, apiPut } from "@/lib/api";

import type {
  Category,
  CategoryListResult,
  CreateCategoryPayload,
  DeleteCategoryResult,
  ListCategoriesParams,
  UpdateCategoryPayload,
} from "./types";

const CATEGORY_ENDPOINT = "/api/v1/categories";

function buildCategoryListPath(params?: ListCategoriesParams): string {
  const searchParams = new URLSearchParams();
  const search = params?.q?.trim();

  if (search) {
    searchParams.set("q", search);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const query = searchParams.toString();
  return query ? `${CATEGORY_ENDPOINT}?${query}` : CATEGORY_ENDPOINT;
}

export async function listCategories(params?: ListCategoriesParams): Promise<CategoryListResult> {
  const response = await apiGetEnvelope<Category[]>(buildCategoryListPath(params));
  const pagination = response.meta.pagination;

  return {
    categories: response.data,
    pagination: {
      currentPage: pagination?.current_page ?? params?.page ?? 1,
      pageSize: pagination?.per_page ?? params?.pageSize ?? 10,
      totalPages: pagination?.total_pages ?? 0,
      totalItems: pagination?.total_items ?? response.data.length,
      hasNextPage: pagination?.has_next_page ?? false,
      hasPrevPage: pagination?.has_prev_page ?? false,
    },
  };
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
