export interface ApiPaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface ApiMeta {
  version: string;
  request_id: string;
  timestamp: string;
  pagination?: ApiPaginationMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  status: number;
  message: string;
  data: T;
  meta: ApiMeta;
}

export interface ApiListResponse<T> {
  success: true;
  status: number;
  message: string;
  data: T[];
  meta: ApiMeta;
}

export interface ApiErrorDetails {
  code: string;
  [key: string]: string | string[] | undefined;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  data: null;
  meta: ApiMeta;
  errors: ApiErrorDetails;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
