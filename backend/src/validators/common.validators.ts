import { z } from 'zod';

/**
 * Validates the `:id` route parameter shared by all single-resource endpoints.
 * `coerce` turns the string param into a number so handlers receive a real
 * positive integer (or a 400 before the controller ever runs).
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int('Id must be an integer').positive('Id must be a positive integer'),
});
