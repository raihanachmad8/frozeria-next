import { describe, expect, it } from "vitest";

import { apiResult, dataResponse, errorResponse, isApiHandlerResult } from "@/server/http/response";

describe("API responses", () => {
  it("builds a success envelope with request id and pagination metadata", async () => {
    const response = dataResponse([{ id: "item-id" }], {
      requestId: "request-id",
      pagination: {
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_items: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    expect(response.headers.get("x-request-id")).toBe("request-id");
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      status: 200,
      data: [{ id: "item-id" }],
      meta: {
        request_id: "request-id",
        pagination: {
          current_page: 1,
          total_items: 1,
        },
      },
    });
  });

  it("builds an error envelope with a default error code", async () => {
    const response = errorResponse({ status: 404, message: "Not found", requestId: "request-id" });

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      status: 404,
      message: "Not found",
      data: null,
      errors: {
        code: "NOT_FOUND",
      },
    });
  });

  it("marks API handler results", () => {
    const result = apiResult(["data"]);

    expect(isApiHandlerResult(result)).toBe(true);
    expect(isApiHandlerResult(["data"])).toBe(false);
  });
});
