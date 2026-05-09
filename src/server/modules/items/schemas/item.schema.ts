import { z } from "zod";

const optionalNullableTextSchema = (max: number, message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    },
    z.string().max(max, message).nullable().optional(),
  );

const itemNameSchema = z.string().trim().min(1, "Item name is required").max(150, "Item name is too long");
const itemUnitSchema = z.string().trim().min(1, "Item unit is required").max(40, "Item unit is too long");
const nonNegativeIntegerSchema = z.coerce.number().int().min(0);
const categoryIdSchema = z
  .preprocess((value) => {
    if (value === "" || value === null) return null;
    return value;
  }, z.string().uuid("Invalid category id").nullable().optional());

export const itemIdSchema = z.string().uuid("Invalid item id");

export const listItemsSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, "Search keyword is too long")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  categoryId: categoryIdSchema,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["name", "stock", "sellingPrice", "createdAt"]).default("name"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export const createItemSchema = z.object({
  name: itemNameSchema,
  categoryId: categoryIdSchema,
  stock: nonNegativeIntegerSchema,
  minimumStock: nonNegativeIntegerSchema.default(20),
  unit: itemUnitSchema,
  packageSize: optionalNullableTextSchema(80, "Package size is too long"),
  purchasePrice: nonNegativeIntegerSchema.default(0),
  sellingPrice: nonNegativeIntegerSchema,
  photoUrl: optionalNullableTextSchema(500, "Photo URL is too long"),
  storageLocation: optionalNullableTextSchema(120, "Storage location is too long"),
  description: optionalNullableTextSchema(500, "Item description is too long"),
});

export const updateItemSchema = createItemSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one item field must be provided",
});

export type ListItemsInput = z.infer<typeof listItemsSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
