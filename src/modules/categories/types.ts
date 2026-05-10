export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListCategoriesParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CategoryListPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CategoryListResult {
  categories: Category[];
  pagination: CategoryListPagination;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
}

export interface DeleteCategoryResult {
  id: string;
}
