import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/server/http/errors";
import { createStorageDriver } from "@/server/modules/storage";

import { uploadItemPhoto } from "@/server/modules/uploads/services/item-photo-upload.service";

vi.mock("@/server/modules/storage", () => ({
  createStorageDriver: vi.fn(),
}));

function formDataWithFile(file?: File): FormData {
  const formData = new FormData();
  if (file) formData.set("file", file);
  return formData;
}

describe("uploadItemPhoto", () => {
  const uploadItemPhotoMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    uploadItemPhotoMock.mockResolvedValue({
      url: "/uploads/items/photo.png",
      key: "items/photo.png",
      provider: "local",
    });
    vi.mocked(createStorageDriver).mockReturnValue({
      uploadItemPhoto: uploadItemPhotoMock,
    });
  });

  it("uploads a supported image and returns upload metadata", async () => {
    const file = new File(["image"], "photo.png", { type: "image/png" });

    await expect(uploadItemPhoto(formDataWithFile(file))).resolves.toEqual({
      url: "/uploads/items/photo.png",
      key: "items/photo.png",
      provider: "local",
      contentType: "image/png",
      size: file.size,
    });
    expect(uploadItemPhotoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        buffer: expect.any(Buffer),
        contentType: "image/png",
        extension: "png",
        fileName: expect.stringMatching(/\.png$/),
      }),
    );
  });

  it("requires a file field", async () => {
    await expect(uploadItemPhoto(new FormData())).rejects.toMatchObject({
      status: 422,
      code: "PHOTO_FILE_REQUIRED",
    } satisfies Partial<AppError>);
  });

  it("rejects unsupported file types", async () => {
    const file = new File(["text"], "photo.txt", { type: "text/plain" });

    await expect(uploadItemPhoto(formDataWithFile(file))).rejects.toMatchObject({
      status: 422,
      code: "UNSUPPORTED_PHOTO_TYPE",
    } satisfies Partial<AppError>);
  });

  it("rejects files larger than 2 MB", async () => {
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "photo.png", { type: "image/png" });

    await expect(uploadItemPhoto(formDataWithFile(file))).rejects.toMatchObject({
      status: 422,
      code: "PHOTO_TOO_LARGE",
    } satisfies Partial<AppError>);
  });
});
