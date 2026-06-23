import { AppError } from './AppError';

/**
 * Thrown when request input fails Zod validation. Maps to HTTP 400 and carries a
 * `fields` map of `fieldName -> message` for the client to render inline.
 */
export class ValidationError extends AppError {
  constructor(fields: Record<string, string>, message = 'Validation failed') {
    super('VALIDATION_ERROR', message, 400, fields);
  }
}
