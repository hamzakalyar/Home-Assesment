import { AppError } from './AppError';

/** Thrown for malformed or semantically invalid requests. Maps to HTTP 400. */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super('BAD_REQUEST', message, 400);
  }
}
