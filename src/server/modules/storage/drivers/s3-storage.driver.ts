import { AppError } from "@/server/http/errors";

import type { StorageDriver, UploadedFile } from "../types";

export class S3StorageDriver implements StorageDriver {
  uploadItemPhoto(): Promise<UploadedFile> {
    throw new AppError(
      "S3-compatible storage is reserved for a later deployment hardening step.",
      501,
      "S3_STORAGE_NOT_IMPLEMENTED",
    );
  }
}
