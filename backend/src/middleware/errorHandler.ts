import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

interface ErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

/**
 * Global error handler. Catches `AppError` subclasses thrown anywhere in the
 * request lifecycle and formats them into the standard response shape. Anything
 * else is an unexpected bug, so it is logged and returned as a generic 500.
 *
 * Must be registered last, after all routes.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express identifies error handlers by their four-argument signature, so `next`
  // must be present even though it is unused here.
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ErrorBody = { error: { code: err.code, message: err.message } };
    if (err.fields) {
      body.error.fields = err.fields;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('Unhandled error:', err);
  const body: ErrorBody = {
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  };
  res.status(500).json(body);
}
