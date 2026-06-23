/**
 * Base class for all expected, operational errors in the application.
 *
 * Services throw `AppError` subclasses (never return error objects); the global
 * `errorHandler` middleware catches them and formats the standard JSON response.
 * Each subclass fixes its own `code` and `statusCode`.
 */
export abstract class AppError extends Error {
  /** Machine-readable error code, e.g. "NOT_FOUND". */
  public readonly code: string;
  /** HTTP status code to respond with. */
  public readonly statusCode: number;
  /** Optional per-field messages (used by validation errors). */
  public readonly fields?: Record<string, string>;

  protected constructor(
    code: string,
    message: string,
    statusCode: number,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
  }
}
