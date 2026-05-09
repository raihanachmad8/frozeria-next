import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { env } from "@/server/env";

import type { StorageDriver, UploadedFile, UploadFileInput } from "../types";

function getPublicStoragePath(): string {
  const normalizedPath = env.LOCAL_STORAGE_PUBLIC_PATH.trim().replace(/\\/g, "/").replace(/\/+$/, "");
  return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
}

export class LocalStorageDriver implements StorageDriver {
  async uploadItemPhoto(file: UploadFileInput): Promise<UploadedFile> {
    const publicStoragePath = getPublicStoragePath();
    const key = `items/${file.fileName}`;
    const uploadDirectory = join(process.cwd(), "public", publicStoragePath.replace(/^\/+/, ""), "items");
    const filePath = join(uploadDirectory, file.fileName);

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(filePath, file.buffer);

    return {
      url: `${publicStoragePath}/${key}`,
      key,
      provider: "local",
    };
  }
}
