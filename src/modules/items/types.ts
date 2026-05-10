export interface ItemCategory {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string | null;
  category: ItemCategory | null;
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

export type ItemSortBy = "name" | "stock" | "sellingPrice" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface ListItemsParams {
  q?: string;
  categoryId?: string | null;
  page?: number;
  pageSize?: number;
  sortBy?: ItemSortBy;
  sortDirection?: SortDirection;
}

export interface ItemListPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ItemListResult {
  items: Item[];
  pagination: ItemListPagination;
}

export interface CreateItemPayload {
  name: string;
  categoryId?: string | null;
  stock: number;
  minimumStock?: number;
  unit: string;
  packageSize?: string | null;
  purchasePrice?: number;
  sellingPrice: number;
  photoUrl?: string | null;
  storageLocation?: string | null;
  description?: string | null;
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

export interface DeleteItemResult {
  id: string;
}

export interface UploadedItemPhoto {
  url: string;
  key: string;
  provider: "local" | "cloudinary" | "s3";
  contentType: string;
  size: number;
}
