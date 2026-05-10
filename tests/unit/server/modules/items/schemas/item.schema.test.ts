import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import {
  createItemSchema,
  itemIdSchema,
  listItemsSchema,
  updateItemSchema,
} from "@/server/modules/items/schemas/item.schema";

const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";

describe("item schemas", () => {
  it("normalizes list params, sort params, and category id", () => {
    expect(
      listItemsSchema.parse({
        q: " Nugget ",
        categoryId: CATEGORY_ID,
        page: "2",
        pageSize: "25",
        sortBy: "stock",
        sortDirection: "desc",
      }),
    ).toEqual({
      q: "Nugget",
      categoryId: CATEGORY_ID,
      page: 2,
      pageSize: 25,
      sortBy: "stock",
      sortDirection: "desc",
    });
  });

  it("normalizes create payload defaults and blank optional text", () => {
    expect(
      createItemSchema.parse({
        name: " Ayam nugget ",
        categoryId: "",
        stock: "12",
        unit: " pcs ",
        packageSize: " ",
        sellingPrice: "35000",
      }),
    ).toEqual({
      name: "Ayam nugget",
      categoryId: null,
      stock: 12,
      minimumStock: 20,
      unit: "pcs",
      packageSize: null,
      purchasePrice: 0,
      sellingPrice: 35000,
    });
  });

  it("rejects negative numeric values", () => {
    expect(() =>
      createItemSchema.parse({
        name: "Ayam nugget",
        stock: -1,
        unit: "pcs",
        sellingPrice: 35000,
      }),
    ).toThrow(ZodError);
  });

  it("requires update payload to contain at least one field", () => {
    expect(() => updateItemSchema.parse({})).toThrow(ZodError);
  });

  it("rejects invalid item ids", () => {
    expect(() => itemIdSchema.parse("not-a-uuid")).toThrow(ZodError);
  });
});
