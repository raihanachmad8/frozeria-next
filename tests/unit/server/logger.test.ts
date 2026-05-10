import { afterEach, describe, expect, it, vi } from "vitest";

import { logger } from "@/server/logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redacts sensitive fields recursively", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    logger.info("test log", {
      requestId: "request-id",
      DATABASE_URL: "postgres://secret",
      nested: {
        apiSecret: "secret-value",
        safe: "visible",
      },
    });

    expect(infoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: "request-id",
        DATABASE_URL: "[redacted]",
        nested: {
          apiSecret: "[redacted]",
          safe: "visible",
        },
      }),
    );
  });

  it("logs errors without stack traces or raw objects", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logger.error("failed", { error: new Error("Something failed") });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: {
          name: "Error",
          message: "Something failed",
        },
      }),
    );
  });
});
