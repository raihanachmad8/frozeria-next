import { randomUUID } from "node:crypto";

import { AppError } from "@/server/http/errors";
import { createStorageDriver, type UploadedFile } from "@/server/modules/storage";

const MAX_ITEM_PHOTO_SIZE = 2 * 1024 * 1024;
const ALLOWED_ITEM_PHOTO_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export interface UploadedItemPhotoDto extends UploadedFile {
  contentType: string;
  size: number;
}

function getItemPhotoFile(formData: FormData): File {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new AppError("Photo file is required.", 422, "PHOTO_FILE_REQUIRED", {
      code: "PHOTO_FILE_REQUIRED",
      file: ["Photo file is required."],
    });
  }

  return file;
}

export async function uploadItemPhoto(formData: FormData): Promise<UploadedItemPhotoDto> {
  const file = getItemPhotoFile(formData);
  const extension = ALLOWED_ITEM_PHOTO_TYPES.get(file.type);

  if (!extension) {
    throw new AppError("Photo must be a JPG, PNG, or WebP image.", 422, "UNSUPPORTED_PHOTO_TYPE", {
      code: "UNSUPPORTED_PHOTO_TYPE",
      file: ["Photo must be a JPG, PNG, or WebP image."],
    });
  }

  if (file.size > MAX_ITEM_PHOTO_SIZE) {
    throw new AppError("Photo must not exceed 2 MB.", 422, "PHOTO_TOO_LARGE", {
      code: "PHOTO_TOO_LARGE",
      file: ["Photo must not exceed 2 MB."],
    });
  }

  const uploadedFile = await createStorageDriver().uploadItemPhoto({
    buffer: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
    extension,
    fileName: `${randomUUID()}.${extension}`,
  });

  return {
    ...uploadedFile,
    contentType: file.type,
    size: file.size,
  };
}
