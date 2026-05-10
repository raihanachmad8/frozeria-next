import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import {
  categoryIdSchema,
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
} from "@/server/modules/categories/schemas/category.schema";

describe("category schemas", () => {
  it("normalizes list params and trims search keywords", () => {
    expect(listCategoriesSchema.parse({ q: " Ayam ", page: "2", pageSize: "25" })).toEqual({
      q: "Ayam",
      page: 2,
      pageSize: 25,
    });
  });

  it("normalizes blank optional description to null", () => {
    expect(createCategorySchema.parse({ name: " Ayam ", description: "  " })).toEqual({
      name: "Ayam",
      description: null,
    });
  });

  it("requires an update payload to contain at least one field", () => {
    expect(() => updateCategorySchema.parse({})).toThrow(ZodError);
  });

  it("rejects invalid category ids", () => {
    expect(() => categoryIdSchema.parse("not-a-uuid")).toThrow(ZodError);
  });
});
