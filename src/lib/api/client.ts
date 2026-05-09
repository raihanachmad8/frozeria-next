import type { ApiErrorDetails, ApiErrorResponse, ApiSuccessResponse } from "@/commons/types";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "REQUEST_FAILED",
    public readonly errors?: ApiErrorDetails,
  ) {
    super(message);
  }
}

function isApiSuccessResponse<T>(payload: unknown): payload is ApiSuccessResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === true &&
    "data" in payload
  );
}

function isApiErrorResponse(payload: unknown): payload is ApiErrorResponse {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === false &&
    "errors" in payload
  );
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiClientError(payload.message, payload.status, payload.errors.code, payload.errors);
    }

    throw new ApiClientError(`Request failed with ${response.status}`, response.status);
  }

  if (isApiSuccessResponse<T>(payload)) {
    return payload.data;
  }

  return payload as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return requestJson<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return requestJson<T>(path, {
    method: "POST",
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return requestJson<T>(path, {
    method: "PUT",
    body: JSON.stringify(body ?? {}),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return requestJson<T>(path, {
    method: "DELETE",
  });
}
