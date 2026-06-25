'use client';

import { useState } from 'react';
import { productsApi } from '@/api-client/products';
import type { Product } from '@/api-client/types';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { NO_FORM_ERRORS, toFormErrors, type FormErrors } from '@/lib/fieldErrors';

interface AdjustStockModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdjustStockModal({ product, onClose, onSuccess }: AdjustStockModalProps) {
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<FormErrors>(NO_FORM_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!product) return;
    setSubmitting(true);
    setErrors(NO_FORM_ERRORS);

    try {
      await productsApi.adjustStock(product.id, { delta: Number(delta), reason });
      onSuccess();
      onClose();
    } catch (error) {
      const formErrors = toFormErrors(error);
      // Map INSUFFICIENT_STOCK to the delta field so it shows inline
      if (formErrors.message?.includes('Insufficient stock')) {
        setErrors({ message: null, fields: { delta: formErrors.message } });
      } else {
        setErrors(formErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={product !== null} onClose={onClose} title={`Adjust stock — ${product.name}`}>
      <p className="mb-4 text-sm text-slate-600">
        Current stock: <span className="font-medium text-slate-900">{product.stock}</span>.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ErrorMessage message={errors.message} />
        <FormField label="Delta" htmlFor="adjust-delta" error={errors.fields.delta}>
          <Input
            id="adjust-delta"
            type="number"
            value={delta}
            hasError={Boolean(errors.fields.delta)}
            onChange={(event) => setDelta(event.target.value)}
            placeholder="e.g. -3 or +10"
          />
        </FormField>
        <FormField label="Reason" htmlFor="adjust-reason" error={errors.fields.reason}>
          <Input
            id="adjust-reason"
            value={reason}
            hasError={Boolean(errors.fields.reason)}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Damaged units removed from inventory"
          />
        </FormField>
        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Adjust stock'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
