import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createItem, listItems } from "@/server/modules/items";

import { GET, POST } from "@/app/api/v1/items/route";

vi.mock("@/server/modules/items", () => ({
  createItem: vi.fn(),
  listItems: vi.fn(),
}));

const item = {
  id: "33333333-3333-4333-8333-333333333333",
  name: "Ayam nugget",
  categoryId: null,
  category: null,
  stock: 12,
  minimumStock: 20,
  unit: "pcs",
  packageSize: "500 gram",
  purchasePrice: 12000,
  sellingPrice: 18000,
  photoUrl: null,
  storageLocation: "Freezer A",
  description: null,
  createdAt: "2026-05-09T00:00:00.000Z",
  updatedAt: "2026-05-09T00:00:00.000Z",
};

describe("/api/v1/items route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists items using query params", async () => {
    vi.mocked(listItems).mockResolvedValue({
      items: [item],
      pagination: {
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_items: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    const response = await GET(
      new NextRequest("http://localhost/api/v1/items?q=nugget&page=1&pageSize=10&sortBy=name&sortDirection=asc"),
    );

    expect(listItems).toHaveBeenCalledWith({
      q: "nugget",
      categoryId: undefined,
      page: "1",
      pageSize: "10",
      sortBy: "name",
      sortDirection: "asc",
    });
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: [item],
    });
  });

  it("creates items from JSON body", async () => {
    vi.mocked(createItem).mockResolvedValue(item);

    const payload = {
      name: "Ayam nugget",
      stock: 12,
      unit: "pcs",
      sellingPrice: 18000,
    };
    const response = await POST(
      new NextRequest("http://localhost/api/v1/items", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    expect(createItem).toHaveBeenCalledWith(payload);
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: item,
    });
  });
});
