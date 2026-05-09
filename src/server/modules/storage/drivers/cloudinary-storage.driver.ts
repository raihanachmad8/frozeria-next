import { createHash } from "node:crypto";

import { env } from "@/server/env";
import { AppError } from "@/server/http/errors";

import type { StorageDriver, UploadedFile, UploadFileInput } from "../types";

interface CloudinaryUploadResponse {
  public_id?: string;
  secure_url?: string;
  error?: {
    message?: string;
  };
}

const CLOUDINARY_ITEM_FOLDER = "frozeria/items";

function signCloudinaryParams(params: Record<string, string>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export class CloudinaryStorageDriver implements StorageDriver {
  async uploadItemPhoto(file: UploadFileInput): Promise<UploadedFile> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signatureParams = {
      folder: CLOUDINARY_ITEM_FOLDER,
      timestamp,
    };
    const signature = signCloudinaryParams(signatureParams, env.CLOUDINARY_API_SECRET!);
    const formData = new FormData();
    const dataUri = `data:${file.contentType};base64,${file.buffer.toString("base64")}`;

    formData.set("file", dataUri);
    formData.set("api_key", env.CLOUDINARY_API_KEY!);
    formData.set("timestamp", timestamp);
    formData.set("folder", CLOUDINARY_ITEM_FOLDER);
    formData.set("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok || !payload.secure_url || !payload.public_id) {
      throw new AppError(
        payload.error?.message ?? "Cloudinary upload failed.",
        response.status >= 400 ? response.status : 502,
        "CLOUDINARY_UPLOAD_FAILED",
      );
    }

    return {
      url: payload.secure_url,
      key: payload.public_id,
      provider: "cloudinary",
    };
  }
}
