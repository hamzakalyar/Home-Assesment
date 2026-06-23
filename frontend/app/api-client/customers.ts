import { apiClient } from './client';
import type { Customer, CreateCustomerInput } from './types';

/** Customer API calls. This is the reference module the product calls mirror. */
export const customersApi = {
  list: () => apiClient.get<Customer[]>('/api/customers'),
  create: (input: CreateCustomerInput) => apiClient.post<Customer>('/api/customers', input),
};
