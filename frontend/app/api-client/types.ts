/** Shared API types and the typed error thrown by the API client. */

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

/** Shape of the standard error body returned by the backend. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

/**
 * Error thrown by the API client for any non-2xx response. Carries the backend's
 * machine-readable `code` and, for validation failures, a `fields` map of
 * `fieldName -> message` so forms can render inline errors.
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly fields?: Record<string, string>;

  constructor(code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fields = fields;
  }
}
