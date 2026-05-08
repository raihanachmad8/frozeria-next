import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

function loadLocalEnvFile(fileName: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (process.env.NODE_ENV === "test") return;
  if (process.env.VITEST === "true") return;

  const envPath = join(process.cwd(), fileName);
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value =
      (rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))
        ? rawValue.slice(1, -1)
        : rawValue;

    process.env[key] ||= value;
  }
}

loadLocalEnvFile(".env.local");
loadLocalEnvFile(".env");

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value : undefined;
}

const envSchema = z
  .object({
    DATABASE_URL: z.string().url().optional(),
    STORAGE_DRIVER: z.enum(["local", "cloudinary", "s3"]).default("local"),
    LOCAL_STORAGE_PUBLIC_PATH: z.string().min(1).default("/uploads"),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  })
  .superRefine((value, context) => {
    if (value.STORAGE_DRIVER === "cloudinary") {
      for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const) {
        if (!value[key]) {
          context.addIssue({ code: "custom", path: [key], message: `${key} is required for Cloudinary storage` });
        }
      }
    }

    if (value.STORAGE_DRIVER === "s3") {
      for (const key of ["S3_ENDPOINT", "S3_REGION", "S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const) {
        if (!value[key]) {
          context.addIssue({ code: "custom", path: [key], message: `${key} is required for S3 storage` });
        }
      }
    }
  });

export const env = envSchema.parse({
  ...process.env,
  DATABASE_URL: emptyToUndefined(process.env.DATABASE_URL),
  CLOUDINARY_CLOUD_NAME: emptyToUndefined(process.env.CLOUDINARY_CLOUD_NAME),
  CLOUDINARY_API_KEY: emptyToUndefined(process.env.CLOUDINARY_API_KEY),
  CLOUDINARY_API_SECRET: emptyToUndefined(process.env.CLOUDINARY_API_SECRET),
  S3_ENDPOINT: emptyToUndefined(process.env.S3_ENDPOINT),
  S3_REGION: emptyToUndefined(process.env.S3_REGION),
  S3_BUCKET: emptyToUndefined(process.env.S3_BUCKET),
  S3_ACCESS_KEY_ID: emptyToUndefined(process.env.S3_ACCESS_KEY_ID),
  S3_SECRET_ACCESS_KEY: emptyToUndefined(process.env.S3_SECRET_ACCESS_KEY),
});
