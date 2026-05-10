import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { uploadItemPhoto } from "@/server/modules/uploads";

import { POST } from "@/app/api/v1/uploads/item-photo/route";

vi.mock("@/server/modules/uploads", () => ({
  uploadItemPhoto: vi.fn(),
}));

describe("/api/v1/uploads/item-photo route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads item photos from multipart form data", async () => {
    vi.mocked(uploadItemPhoto).mockResolvedValue({
      url: "/uploads/items/photo.png",
      key: "items/photo.png",
      provider: "local",
      contentType: "image/png",
      size: 5,
    });
    const formData = new FormData();
    formData.set("file", new File(["image"], "photo.png", { type: "image/png" }));

    const response = await POST(
      new NextRequest("http://localhost/api/v1/uploads/item-photo", {
        method: "POST",
        body: formData,
      }),
    );

    expect(uploadItemPhoto).toHaveBeenCalledWith(expect.any(FormData));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        url: "/uploads/items/photo.png",
        provider: "local",
      },
    });
  });
});
