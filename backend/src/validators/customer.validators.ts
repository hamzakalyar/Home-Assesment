import { z } from 'zod';

/**
 * Validation schemas for customer input. The create schema defines the strict
 * rules; the update schema reuses them but makes every field optional (partial
 * update). Inferred types are exported for services and controllers to consume.
 */
export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().trim().toLowerCase().email('Must be a valid email address'),
  phone: z.string().trim().min(7, 'Phone must be at least 7 characters').max(20, 'Phone must be at most 20 characters'),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
