import { AppError } from './AppError';

/** Thrown when a requested resource does not exist. Maps to HTTP 404. */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', message, 404);
  }
}
