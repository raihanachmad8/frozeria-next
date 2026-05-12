import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { logger } from "@/server/logger";

import { AppError } from "@/server/http/errors";
import { handleApi } from "@/server/http/route";

vi.mock("@/server/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("handleApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wraps successful handler results", async () => {
    const request = new NextRequest("https://frozeria.test/api/v1/items?page=1", {
      headers: { "x-request-id": "request-id" },
    });
    const response = await handleApi(() => ({ ok: true }), { message: "OK", request });

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      message: "OK",
      data: { ok: true },
      meta: { request_id: "request-id" },
    });
    expect(response.headers.get("x-request-id")).toBe("request-id");
    expect(logger.info).toHaveBeenCalledWith(
      "API request completed.",
      expect.objectContaining({
        durationMs: expect.any(Number),
        method: "GET",
        pathname: "/api/v1/items",
        requestId: "request-id",
        status: 200,
      }),
    );
  });

  it("returns application errors and logs them", async () => {
    const response = await handleApi(() => {
      throw new AppError("Not found", 404, "NOT_FOUND");
    });

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      status: 404,
      message: "Not found",
      errors: { code: "NOT_FOUND" },
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "API request failed with application error.",
      expect.objectContaining({ durationMs: expect.any(Number), requestId: expect.any(String), status: 404 }),
    );
  });

  it("returns validation errors for Zod failures", async () => {
    const response = await handleApi(() => z.object({ name: z.string().min(1) }).parse({ name: "" }));

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      status: 422,
      errors: {
        code: "VALIDATION_ERROR",
        name: expect.any(Array),
      },
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "API request validation failed.",
      expect.objectContaining({ durationMs: expect.any(Number), requestId: expect.any(String), status: 422 }),
    );
  });

  it("returns internal server errors for unexpected failures", async () => {
    const response = await handleApi(() => {
      throw new Error("Database offline");
    });

    await expect(response.json()).resolves.toMatchObject({
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      errors: { code: "INTERNAL_SERVER_ERROR" },
    });
    expect(logger.error).toHaveBeenCalledWith(
      "API request failed with unexpected error.",
      expect.objectContaining({ durationMs: expect.any(Number), requestId: expect.any(String), status: 500 }),
    );
  });
});
