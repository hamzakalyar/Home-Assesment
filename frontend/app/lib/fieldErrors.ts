import { ApiError } from '@/api-client/types';

export interface FormErrors {
  /** A form-level message shown above the form (null when only field errors apply). */
  message: string | null;
  /** Per-field messages keyed by field name, rendered inline by FormField. */
  fields: Record<string, string>;
}

/**
 * Normalises any thrown error into the shape forms render. Validation failures
 * surface as inline field errors; every other error becomes a single form-level
 * message. This keeps error handling identical across all forms.
 */
export function toFormErrors(error: unknown): FormErrors {
  if (error instanceof ApiError) {
    if (error.fields && Object.keys(error.fields).length > 0) {
      return { message: null, fields: error.fields };
    }
    return { message: error.message, fields: {} };
  }
  return { message: 'Something went wrong. Please try again.', fields: {} };
}

export const NO_FORM_ERRORS: FormErrors = { message: null, fields: {} };
