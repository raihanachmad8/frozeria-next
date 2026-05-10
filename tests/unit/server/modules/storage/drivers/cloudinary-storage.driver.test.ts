import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/server/http/errors";

import { CloudinaryStorageDriver } from "@/server/modules/storage/drivers/cloudinary-storage.driver";

vi.mock("@/server/env", () => ({
  env: {
    CLOUDINARY_API_KEY: "cloudinary-key",
    CLOUDINARY_API_SECRET: "cloudinary-secret",
    CLOUDINARY_CLOUD_NAME: "demo-cloud",
  },
}));

describe("CloudinaryStorageDriver", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-09T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("uploads to Cloudinary and returns the uploaded public file", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          secure_url: "https://res.cloudinary.com/demo/frozeria/items/photo.png",
          public_id: "frozeria/items/photo",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new CloudinaryStorageDriver().uploadItemPhoto({
        buffer: Buffer.from("image"),
        contentType: "image/png",
        extension: "png",
        fileName: "photo.png",
      }),
    ).resolves.toEqual({
      url: "https://res.cloudinary.com/demo/frozeria/items/photo.png",
      key: "frozeria/items/photo",
      provider: "cloudinary",
    });
    expect(fetchMock).toHaveBeenCalledWith("https://api.cloudinary.com/v1_1/demo-cloud/image/upload", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("throws an AppError when Cloudinary upload fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { message: "Invalid signature" } }), {
          status: 401,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    await expect(
      new CloudinaryStorageDriver().uploadItemPhoto({
        buffer: Buffer.from("image"),
        contentType: "image/png",
        extension: "png",
        fileName: "photo.png",
      }),
    ).rejects.toMatchObject({
      status: 401,
      code: "CLOUDINARY_UPLOAD_FAILED",
      message: "Invalid signature",
    } satisfies Partial<AppError>);
  });
});
