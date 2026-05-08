export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DetailResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
}

