import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { API_VERSION } from "@/commons/constants";
import type { ApiErrorDetails, ApiErrorResponse, ApiMeta, ApiPaginationMeta, ApiSuccessResponse } from "@/commons/types";

export interface DataResponseOptions {
  status?: number;
  message?: string;
  requestId?: string;
  pagination?: ApiPaginationMeta;
}

export interface ErrorResponseOptions {
  status?: number;
  message?: string;
  code?: string;
  details?: ApiErrorDetails;
  requestId?: string;
}

const DEFAULT_SUCCESS_MESSAGE = "Request completed successfully.";
const DEFAULT_CREATED_MESSAGE = "Resource created successfully.";
const DEFAULT_ERROR_MESSAGE = "Request failed.";

const STATUS_ERROR_CODES: Record<number, string> = {
  400: "BAD_REQUEST",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  500: "INTERNAL_SERVER_ERROR",
};

interface ApiHandlerResult<T> {
  data: T;
  pagination?: ApiPaginationMeta;
  type: "api-handler-result";
}

function buildMeta(requestId: string, pagination?: ApiPaginationMeta): ApiMeta {
  return {
    version: API_VERSION,
    request_id: requestId,
    timestamp: new Date().toISOString(),
    ...(pagination ? { pagination } : {}),
  };
}

function buildHeaders(requestId: string): HeadersInit {
  return {
    "X-Request-Id": requestId,
  };
}

function buildJsonResponse<T>(payload: T, status: number, requestId: string): NextResponse<T> {
  return NextResponse.json(payload, {
    status,
    headers: buildHeaders(requestId),
  });
}

function resolveRequestId(requestId?: string): string {
  return requestId?.trim() || randomUUID();
}

export function dataResponse<T>(data: T, options?: DataResponseOptions): NextResponse<ApiSuccessResponse<T>> {
  const status = options?.status ?? 200;
  const requestId = resolveRequestId(options?.requestId);
  const payload: ApiSuccessResponse<T> = {
    success: true,
    status,
    message: options?.message ?? (status === 201 ? DEFAULT_CREATED_MESSAGE : DEFAULT_SUCCESS_MESSAGE),
    data,
    meta: buildMeta(requestId, options?.pagination),
  };

  return buildJsonResponse(payload, status, requestId);
}

export function errorResponse(options?: ErrorResponseOptions): NextResponse<ApiErrorResponse> {
  const status = options?.status ?? 400;
  const code = options?.code ?? STATUS_ERROR_CODES[status] ?? "REQUEST_FAILED";
  const requestId = resolveRequestId(options?.requestId);
  const payload: ApiErrorResponse = {
    success: false,
    status,
    message: options?.message ?? DEFAULT_ERROR_MESSAGE,
    data: null,
    meta: buildMeta(requestId),
    errors: options?.details ?? { code },
  };

  return buildJsonResponse(payload, status, requestId);
}

export function apiResult<T>(data: T, options?: { pagination?: ApiPaginationMeta }): ApiHandlerResult<T> {
  return {
    type: "api-handler-result",
    data,
    pagination: options?.pagination,
  };
}

export function isApiHandlerResult<T>(value: unknown): value is ApiHandlerResult<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "api-handler-result" &&
    "data" in value
  );
}
