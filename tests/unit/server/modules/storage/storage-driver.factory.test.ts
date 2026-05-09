import { afterEach, describe, expect, it, vi } from "vitest";

async function createDriverFor(storageDriver: "local" | "cloudinary" | "s3") {
  vi.resetModules();
  vi.doMock("@/server/env", () => ({
    env: {
      STORAGE_DRIVER: storageDriver,
      LOCAL_STORAGE_PUBLIC_PATH: "/uploads",
    },
  }));

  const { createStorageDriver } = await import("@/server/modules/storage/storage-driver.factory");
  return createStorageDriver();
}

describe("createStorageDriver", () => {
  afterEach(() => {
    vi.doUnmock("@/server/env");
    vi.resetModules();
  });

  it("creates the local storage driver by default", async () => {
    await expect(createDriverFor("local")).resolves.toMatchObject({
      constructor: expect.objectContaining({ name: "LocalStorageDriver" }),
    });
  });

  it("creates the Cloudinary storage driver", async () => {
    await expect(createDriverFor("cloudinary")).resolves.toMatchObject({
      constructor: expect.objectContaining({ name: "CloudinaryStorageDriver" }),
    });
  });

  it("creates the S3 storage driver placeholder", async () => {
    await expect(createDriverFor("s3")).resolves.toMatchObject({
      constructor: expect.objectContaining({ name: "S3StorageDriver" }),
    });
  });
});
