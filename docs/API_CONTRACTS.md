# API Contracts

This document defines the HTTP response contract for all Frozeria backend API routes.

## Scope

All application API routes under `/api/v1` must return the same response envelope. Route handlers should stay thin and use helpers from `src/server/http/*`.

## Success Response

Use this shape for successful single-resource, action, and list responses.

```ts
type ApiSuccessResponse<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
  meta: {
    version: string;
    request_id: string;
    timestamp: string;
    pagination?: {
      current_page: number;
      per_page: number;
      total_pages: number;
      total_items: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
  };
};
```

Example:

```json
{
  "success": true,
  "status": 200,
  "message": "Category retrieved successfully.",
  "data": {
    "id": "uuid",
    "name": "Ayam",
    "description": "Produk ayam beku",
    "createdAt": "2026-05-09T00:00:00.000Z",
    "updatedAt": "2026-05-09T00:00:00.000Z"
  },
  "meta": {
    "version": "v1",
    "request_id": "uuid",
    "timestamp": "2026-05-09T00:00:00.000Z"
  }
}
```

## Error Response

Use this shape for every failed request.

```ts
type ApiErrorResponse = {
  success: false;
  status: number;
  message: string;
  data: null;
  meta: {
    version: string;
    request_id: string;
    timestamp: string;
  };
  errors: {
    code: string;
    [key: string]: string | string[] | undefined;
  };
};
```

Example:

```json
{
  "success": false,
  "status": 422,
  "message": "Validation failed.",
  "data": null,
  "meta": {
    "version": "v1",
    "request_id": "uuid",
    "timestamp": "2026-05-09T00:00:00.000Z"
  },
  "errors": {
    "code": "VALIDATION_ERROR",
    "name": ["Category name is required"]
  }
}
```

## Request Id

Rules:

- If the client sends `X-Request-Id`, the response must reuse it.
- If the client does not send `X-Request-Id`, the server generates one.
- The response must also include the same value in the `X-Request-Id` header.

## Error Codes

Rules:

- Validation errors use `VALIDATION_ERROR`.
- Invalid JSON body uses `INVALID_JSON_BODY`.
- Unexpected server errors use `INTERNAL_SERVER_ERROR`.
- Domain errors should use stable domain codes, for example `CATEGORY_NOT_FOUND` or `CATEGORY_NAME_EXISTS`.
- Error messages must be safe for users and must not expose secrets, database URLs, stack traces, or raw SQL.

## Route Handler Rules

Rules:

- Route handlers should call `handleApi()`.
- Services must throw `AppError` for domain failures.
- Services must not build HTTP responses.
- Repositories must not build HTTP responses.
- Client modules should unwrap `.data` and keep the envelope out of feature UI.

