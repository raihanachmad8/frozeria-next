import { z } from "zod";

const categoryNameSchema = z.string().trim().min(1, "Category name is required").max(100, "Category name is too long");

const categoryDescriptionSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  },
  z.string().max(500, "Category description is too long").nullable().optional(),
);

export const categoryIdSchema = z.string().uuid("Invalid category id");

export const listCategoriesSchema = z.object({
  q: z
    .string()
    .trim()
    .max(100, "Search keyword is too long")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export const createCategorySchema = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema,
});

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),
    description: categoryDescriptionSchema,
  })
  .refine((value) => value.name !== undefined || value.description !== undefined, {
    message: "At least one category field must be provided",
  });

export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
