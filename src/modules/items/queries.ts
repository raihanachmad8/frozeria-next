"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/modules/dashboard/keys";
import { categoryKeys } from "@/modules/categories/keys";

import { createItem, deleteItem, getItem, listItems, updateItem } from "./api";
import { itemKeys } from "./keys";
import type { CreateItemPayload, ListItemsParams, UpdateItemPayload } from "./types";

interface UseItemQueryOptions {
  id: string;
  enabled?: boolean;
}

function useInvalidateItemDependencies() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: itemKeys.all }),
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
    ]);
}

export function useItemsQuery(params: ListItemsParams = {}) {
  return useQuery({
    queryKey: itemKeys.list(params),
    queryFn: () => listItems(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useItemQuery({ id, enabled = true }: UseItemQueryOptions) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItem(id),
    enabled: enabled && id.length > 0,
  });
}

export function useCreateItemMutation() {
  const invalidateDependencies = useInvalidateItemDependencies();

  return useMutation({
    mutationFn: (payload: CreateItemPayload) => createItem(payload),
    onSuccess: invalidateDependencies,
  });
}

export function useUpdateItemMutation() {
  const invalidateDependencies = useInvalidateItemDependencies();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemPayload }) => updateItem(id, payload),
    onSuccess: invalidateDependencies,
  });
}

export function useDeleteItemMutation() {
  const invalidateDependencies = useInvalidateItemDependencies();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: invalidateDependencies,
  });
}
