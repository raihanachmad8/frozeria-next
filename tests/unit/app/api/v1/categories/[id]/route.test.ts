import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteCategory, getCategoryById, updateCategory } from "@/server/modules/categories";

import { DELETE, GET, PUT } from "@/app/api/v1/categories/[id]/route";

vi.mock("@/server/modules/categories", () => ({
  deleteCategory: vi.fn(),
  getCategoryById: vi.fn(),
  updateCategory: vi.fn(),
}));

const category = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Ayam",
  description: null,
  createdAt: "2026-05-09T00:00:00.000Z",
  updatedAt: "2026-05-09T00:00:00.000Z",
};

const context = { params: Promise.resolve({ id: category.id }) };

describe("/api/v1/categories/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets a category by id", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(category);

    const response = await GET(new NextRequest(`http://localhost/api/v1/categories/${category.id}`), context);

    expect(getCategoryById).toHaveBeenCalledWith(category.id);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: category });
  });

  it("updates a category by id", async () => {
    vi.mocked(updateCategory).mockResolvedValue({ ...category, name: "Sapi" });

    const response = await PUT(
      new NextRequest(`http://localhost/api/v1/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: "Sapi" }),
      }),
      context,
    );

    expect(updateCategory).toHaveBeenCalledWith(category.id, { name: "Sapi" });
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { name: "Sapi" } });
  });

  it("deletes a category by id", async () => {
    vi.mocked(deleteCategory).mockResolvedValue({ id: category.id });

    const response = await DELETE(new NextRequest(`http://localhost/api/v1/categories/${category.id}`), context);

    expect(deleteCategory).toHaveBeenCalledWith(category.id);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { id: category.id } });
  });
});
