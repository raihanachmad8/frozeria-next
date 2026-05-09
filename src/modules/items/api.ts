import { apiDelete, apiGet, apiGetEnvelope, apiPost, apiPut } from "@/lib/api";

import type { CreateItemPayload, DeleteItemResult, Item, ItemListResult, ListItemsParams, UpdateItemPayload } from "./types";

const ITEM_ENDPOINT = "/api/v1/items";

function buildItemListPath(params?: ListItemsParams): string {
  const searchParams = new URLSearchParams();
  const search = params?.q?.trim();

  if (search) {
    searchParams.set("q", search);
  }

  if (params?.categoryId) {
    searchParams.set("categoryId", params.categoryId);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  if (params?.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params?.sortDirection) {
    searchParams.set("sortDirection", params.sortDirection);
  }

  const query = searchParams.toString();
  return query ? `${ITEM_ENDPOINT}?${query}` : ITEM_ENDPOINT;
}

export async function listItems(params?: ListItemsParams): Promise<ItemListResult> {
  const response = await apiGetEnvelope<Item[]>(buildItemListPath(params));
  const pagination = response.meta.pagination;

  return {
    items: response.data,
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

export function getItem(id: string): Promise<Item> {
  return apiGet<Item>(`${ITEM_ENDPOINT}/${id}`);
}

export function createItem(payload: CreateItemPayload): Promise<Item> {
  return apiPost<Item>(ITEM_ENDPOINT, payload);
}

export function updateItem(id: string, payload: UpdateItemPayload): Promise<Item> {
  return apiPut<Item>(`${ITEM_ENDPOINT}/${id}`, payload);
}

export function deleteItem(id: string): Promise<DeleteItemResult> {
  return apiDelete<DeleteItemResult>(`${ITEM_ENDPOINT}/${id}`);
}
