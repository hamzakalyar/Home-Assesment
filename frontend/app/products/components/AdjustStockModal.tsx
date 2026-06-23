'use client';

import type { Product } from '@/api-client/types';
import { Modal } from '@/components/Modal';

interface AdjustStockModalProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * TASK B — implement the stock-adjustment dialog.
 *
 * This stub gives you the entry point: the "Adjust Stock" button on the products
 * page opens this modal. Build the form inside it following the existing patterns
 * (ProductForm + EditProductModal are good references):
 *
 *   - a `delta` input that allows negative numbers,
 *   - a `reason` input (3–200 characters),
 *   - call a new `productsApi.adjustStock(product.id, { delta, reason })` (add it
 *     in app/api-client/products.ts) which POSTs to /api/products/:id/adjust-stock,
 *   - render the INSUFFICIENT_STOCK / validation errors inline using `toFormErrors`,
 *   - on success, refresh the product list and close the modal. Add an `onAdjusted`
 *     callback prop and wire it from the page, as EditProductModal does with `onSaved`.
 *
 * See the README for the full endpoint specification.
 */
export function AdjustStockModal({ product, onClose }: AdjustStockModalProps) {
  if (!product) {
    return null;
  }

  return (
    <Modal isOpen={product !== null} onClose={onClose} title={`Adjust stock — ${product.name}`}>
      <p className="text-sm text-slate-600">
        Current stock: <span className="font-medium text-slate-900">{product.stock}</span>.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Stock adjustment is not implemented yet — this is Task B. Build the form here.
      </p>
    </Modal>
  );
}
