import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteItem, getItemById, updateItem } from "@/server/modules/items";

import { DELETE, GET, PUT } from "@/app/api/v1/items/[id]/route";

vi.mock("@/server/modules/items", () => ({
  deleteItem: vi.fn(),
  getItemById: vi.fn(),
  updateItem: vi.fn(),
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

const context = { params: Promise.resolve({ id: item.id }) };

describe("/api/v1/items/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets an item by id", async () => {
    vi.mocked(getItemById).mockResolvedValue(item);

    const response = await GET(new NextRequest(`http://localhost/api/v1/items/${item.id}`), context);

    expect(getItemById).toHaveBeenCalledWith(item.id);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: item });
  });

  it("updates an item by id", async () => {
    vi.mocked(updateItem).mockResolvedValue({ ...item, stock: 20 });

    const response = await PUT(
      new NextRequest(`http://localhost/api/v1/items/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ stock: 20 }),
      }),
      context,
    );

    expect(updateItem).toHaveBeenCalledWith(item.id, { stock: 20 });
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { stock: 20 } });
  });

  it("deletes an item by id", async () => {
    vi.mocked(deleteItem).mockResolvedValue({ id: item.id });

    const response = await DELETE(new NextRequest(`http://localhost/api/v1/items/${item.id}`), context);

    expect(deleteItem).toHaveBeenCalledWith(item.id);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { id: item.id } });
  });
});
