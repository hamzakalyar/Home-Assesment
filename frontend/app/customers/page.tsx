'use client';

import { useCallback, useEffect, useState } from 'react';
import { customersApi } from '@/api-client/customers';
import type { Customer } from '@/api-client/types';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/Input';
import { NO_FORM_ERRORS, toFormErrors, type FormErrors } from '@/lib/fieldErrors';

const EMPTY_FORM = { name: '', email: '', phone: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>(NO_FORM_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  const loadCustomers = useCallback(async () => {
    setCustomers(await customersApi.list());
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors(NO_FORM_ERRORS);

    try {
      await customersApi.create(form);
      setForm(EMPTY_FORM);
      await loadCustomers();
    } catch (error) {
      setErrors(toFormErrors(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <ErrorMessage message={errors.message} />
          <FormField label="Name" htmlFor="name" error={errors.fields.name}>
            <Input
              id="name"
              value={form.name}
              hasError={Boolean(errors.fields.name)}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.fields.email}>
            <Input
              id="email"
              type="email"
              value={form.email}
              hasError={Boolean(errors.fields.email)}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone" error={errors.fields.phone}>
            <Input
              id="phone"
              value={form.phone}
              hasError={Boolean(errors.fields.phone)}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </FormField>
          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add customer'}
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">All customers</h2>
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {customers.map((customer) => (
            <li key={customer.id} className="flex flex-col px-4 py-3">
              <span className="font-medium text-slate-900">{customer.name}</span>
              <span className="text-sm text-slate-600">
                {customer.email} · {customer.phone}
              </span>
            </li>
          ))}
          {customers.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">No customers yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
