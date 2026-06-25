import { apiClient } from './client';
import type { CreateProductInput, Product, UpdateProductInput } from './types';

/** Product API calls used by the /products page. */
export const productsApi = {
  list: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get<Product[]>(`/api/products${query}`);
  },
  create: (input: CreateProductInput) => apiClient.post<Product>('/api/products', input),
  // The Edit flow calls this; it returns 501 until updateProduct is implemented (Task A).
  update: (id: number, input: UpdateProductInput) =>
    apiClient.patch<Product>(`/api/products/${id}`, input),
  remove: (id: number) => apiClient.delete(`/api/products/${id}`),

  // TASK B — add the stock-adjustment call here, e.g.:

  adjustStock: (id: number, input: { delta: number; reason: string }) =>
    apiClient.post<Product>(`/api/products/${id}/adjust-stock`, input),

};
