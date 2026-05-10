import { mkdir, writeFile } from "node:fs/promises";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocalStorageDriver } from "@/server/modules/storage/drivers/local-storage.driver";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock("@/server/env", () => ({
  env: {
    LOCAL_STORAGE_PUBLIC_PATH: "uploads/",
  },
}));

describe("LocalStorageDriver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes item photos to the public upload directory and returns a public URL", async () => {
    const result = await new LocalStorageDriver().uploadItemPhoto({
      buffer: Buffer.from("image"),
      contentType: "image/png",
      extension: "png",
      fileName: "photo.png",
    });

    expect(mkdir).toHaveBeenCalledWith(expect.stringContaining("public"), { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(expect.stringContaining("photo.png"), Buffer.from("image"));
    expect(result).toEqual({
      url: "/uploads/items/photo.png",
      key: "items/photo.png",
      provider: "local",
    });
  });
});
