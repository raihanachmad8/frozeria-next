import { describe, expect, it, vi } from "vitest";
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
  it("wraps successful handler results", async () => {
    const response = await handleApi(() => ({ ok: true }), { message: "OK" });

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      message: "OK",
      data: { ok: true },
    });
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
    expect(logger.warn).toHaveBeenCalledWith("API request failed with application error.", expect.objectContaining({ status: 404 }));
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
    expect(logger.warn).toHaveBeenCalledWith("API request validation failed.", expect.objectContaining({ status: 422 }));
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
    expect(logger.error).toHaveBeenCalledWith("API request failed with unexpected error.", expect.objectContaining({ status: 500 }));
  });
});
