import { AppError } from './AppError';

/**
 * Thrown by service methods that are intentionally left unimplemented in the
 * starter (see Task A). Maps to HTTP 501.
 */
export class NotImplementedError extends AppError {
  constructor(message: string) {
    super('NOT_IMPLEMENTED', message, 501);
  }
}
