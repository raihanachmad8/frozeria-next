import { describe, expect, it } from "vitest";

import { AppError } from "@/server/http/errors";

import { S3StorageDriver } from "@/server/modules/storage/drivers/s3-storage.driver";

describe("S3StorageDriver", () => {
  it("fails explicitly until the S3 adapter is implemented", async () => {
    expect(() => new S3StorageDriver().uploadItemPhoto()).toThrow(
      "S3-compatible storage is reserved for a later deployment hardening step.",
    );
    expect(() => new S3StorageDriver().uploadItemPhoto()).toThrow(
      expect.objectContaining({
      status: 501,
      code: "S3_STORAGE_NOT_IMPLEMENTED",
      } satisfies Partial<AppError>),
    );
  });
});
