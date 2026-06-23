import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../errors';

type RequestSource = 'body' | 'params';

/**
 * Builds middleware that validates one part of the request against a Zod schema.
 *
 * On success the parsed (and coerced/trimmed) value replaces the raw input on the
 * request, so controllers always read clean, typed data. On failure it throws a
 * `ValidationError` carrying a `fieldName -> message` map, which the global error
 * handler formats into the standard 400 response.
 */
export function validateRequest(schema: ZodType, source: RequestSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_root';
        // Keep the first message per field for a stable, predictable response.
        if (!(key in fields)) {
          fields[key] = issue.message;
        }
      }
      throw new ValidationError(fields);
    }

    req[source] = result.data;
    next();
  };
}
