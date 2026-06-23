import { z } from 'zod';

/**
 * Validation schemas for product input.
 *
 * - name:  trimmed, 2–100 characters
 * - price: positive number with at most 2 decimal places
 * - stock: non-negative integer
 *
 * The update schema reuses the same per-field rules but makes every field
 * optional, so a partial update only validates the fields that are provided.
 */
const hasAtMostTwoDecimals = (value: number) => {
  const scaled = value * 100;
  return Math.abs(scaled - Math.round(scaled)) < 1e-9;
};

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  price: z
    .number()
    .positive('Price must be greater than 0')
    .refine(hasAtMostTwoDecimals, 'Price may have at most 2 decimal places'),
  stock: z.number().int('Stock must be a whole number').nonnegative('Stock cannot be negative'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
