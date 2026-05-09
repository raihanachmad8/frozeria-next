"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/modules/dashboard/keys";
import { itemKeys } from "@/modules/items/keys";

import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from "./api";
import { categoryKeys } from "./keys";
import type { CreateCategoryPayload, ListCategoriesParams, UpdateCategoryPayload } from "./types";

interface UseCategoryQueryOptions {
  id: string;
  enabled?: boolean;
}

function useInvalidateCategoryDependencies() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: itemKeys.all }),
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
    ]);
}

export function useCategoriesQuery(params: ListCategoriesParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => listCategories(params),
  });
}

export function useCategoryQuery({ id, enabled = true }: UseCategoryQueryOptions) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategory(id),
    enabled: enabled && id.length > 0,
  });
}

export function useCreateCategoryMutation() {
  const invalidateDependencies = useInvalidateCategoryDependencies();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: invalidateDependencies,
  });
}

export function useUpdateCategoryMutation() {
  const invalidateDependencies = useInvalidateCategoryDependencies();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) => updateCategory(id, payload),
    onSuccess: invalidateDependencies,
  });
}

export function useDeleteCategoryMutation() {
  const invalidateDependencies = useInvalidateCategoryDependencies();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidateDependencies,
  });
}
