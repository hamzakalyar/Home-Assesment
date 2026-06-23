'use client';

import { useState } from 'react';
import type { CreateProductInput } from '@/api-client/types';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/Input';
import { NO_FORM_ERRORS, toFormErrors, type FormErrors } from '@/lib/fieldErrors';

interface ProductFormValues {
  name: string;
  price: string;
  stock: string;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  submitLabel: string;
  onSubmit: (input: CreateProductInput) => Promise<unknown>;
  onSuccess: () => void;
}

const EMPTY_VALUES: ProductFormValues = { name: '', price: '', stock: '' };

/**
 * Create/edit form for a product. Owns its field state and renders validation
 * errors using the shared field-error pattern. The parent supplies `onSubmit`
 * (the API call) and `onSuccess` (refresh/close); errors thrown by `onSubmit` are
 * caught here and shown inline.
 */
export function ProductForm({
  initialValues = EMPTY_VALUES,
  submitLabel,
  onSubmit,
  onSuccess,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(NO_FORM_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors(NO_FORM_ERRORS);

    try {
      await onSubmit({
        name: values.name,
        price: Number(values.price),
        stock: Number(values.stock),
      });
      onSuccess();
    } catch (error) {
      setErrors(toFormErrors(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ErrorMessage message={errors.message} />
      <FormField label="Name" htmlFor="product-name" error={errors.fields.name}>
        <Input
          id="product-name"
          value={values.name}
          hasError={Boolean(errors.fields.name)}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
      </FormField>
      <FormField label="Price" htmlFor="product-price" error={errors.fields.price}>
        <Input
          id="product-price"
          type="number"
          step="0.01"
          value={values.price}
          hasError={Boolean(errors.fields.price)}
          onChange={(event) => setValues({ ...values, price: event.target.value })}
        />
      </FormField>
      <FormField label="Stock" htmlFor="product-stock" error={errors.fields.stock}>
        <Input
          id="product-stock"
          type="number"
          value={values.stock}
          hasError={Boolean(errors.fields.stock)}
          onChange={(event) => setValues({ ...values, stock: event.target.value })}
        />
      </FormField>
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
