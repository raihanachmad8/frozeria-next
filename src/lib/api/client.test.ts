import { afterEach, describe, expect, it, vi } from "vitest";

import { apiGet, apiPost, ApiClientError } from "./client";

function mockFetch(payload: unknown, init: ResponseInit = {}) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: init.status ?? 200,
      headers: {
        "content-type": "application/json",
      },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("unwraps successful API envelope data", async () => {
    const fetchMock = mockFetch({
      success: true,
      status: 200,
      message: "Category retrieved successfully.",
      data: {
        id: "category-id",
        name: "Ayam",
      },
      meta: {
        version: "v1",
        request_id: "request-id",
        timestamp: "2026-05-09T00:00:00.000Z",
      },
    });

    await expect(apiGet<{ id: string; name: string }>("/api/v1/categories/category-id")).resolves.toEqual({
      id: "category-id",
      name: "Ayam",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/categories/category-id", expect.objectContaining({ cache: "no-store" }));
  });

  it("throws ApiClientError with envelope error details", async () => {
    mockFetch(
      {
        success: false,
        status: 409,
        message: "Category name already exists",
        data: null,
        meta: {
          version: "v1",
          request_id: "request-id",
          timestamp: "2026-05-09T00:00:00.000Z",
        },
        errors: {
          code: "CATEGORY_NAME_EXISTS",
        },
      },
      { status: 409 },
    );

    await expect(apiPost("/api/v1/categories", { name: "Ayam" })).rejects.toMatchObject({
      message: "Category name already exists",
      status: 409,
      code: "CATEGORY_NAME_EXISTS",
      errors: {
        code: "CATEGORY_NAME_EXISTS",
      },
    } satisfies Partial<ApiClientError>);
  });
});
