import { env } from "@/server/env";

import { CloudinaryStorageDriver } from "./drivers/cloudinary-storage.driver";
import { LocalStorageDriver } from "./drivers/local-storage.driver";
import { S3StorageDriver } from "./drivers/s3-storage.driver";
import type { StorageDriver } from "./types";

export function createStorageDriver(): StorageDriver {
  if (env.STORAGE_DRIVER === "cloudinary") {
    return new CloudinaryStorageDriver();
  }

  if (env.STORAGE_DRIVER === "s3") {
    return new S3StorageDriver();
  }

  return new LocalStorageDriver();
}
