import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCategory, listCategories } from "@/server/modules/categories";

import { GET, POST } from "@/app/api/v1/categories/route";

vi.mock("@/server/modules/categories", () => ({
  createCategory: vi.fn(),
  listCategories: vi.fn(),
}));

const category = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Ayam",
  description: null,
  createdAt: "2026-05-09T00:00:00.000Z",
  updatedAt: "2026-05-09T00:00:00.000Z",
};

describe("/api/v1/categories route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists categories using query params", async () => {
    vi.mocked(listCategories).mockResolvedValue({
      categories: [category],
      pagination: {
        current_page: 2,
        per_page: 10,
        total_pages: 3,
        total_items: 21,
        has_next_page: true,
        has_prev_page: true,
      },
    });

    const response = await GET(new NextRequest("http://localhost/api/v1/categories?q=ayam&page=2&pageSize=10"));

    expect(listCategories).toHaveBeenCalledWith({ q: "ayam", page: "2", pageSize: "10" });
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: [category],
      meta: {
        pagination: {
          current_page: 2,
          total_items: 21,
        },
      },
    });
  });

  it("creates categories from JSON body", async () => {
    vi.mocked(createCategory).mockResolvedValue(category);

    const response = await POST(
      new NextRequest("http://localhost/api/v1/categories", {
        method: "POST",
        body: JSON.stringify({ name: "Ayam" }),
      }),
    );

    expect(createCategory).toHaveBeenCalledWith({ name: "Ayam" });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: category,
    });
  });
});
