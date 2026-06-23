'use client';

import { productsApi } from '@/api-client/products';
import type { Product } from '@/api-client/types';
import { Modal } from '@/components/Modal';
import { ProductForm } from './ProductForm';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Edit dialog for a product. The form is fully wired: submitting calls
 * productsApi.update, which returns 501 until updateProduct is implemented (Task
 * A). Once implemented, this flow saves changes and closes the modal.
 */
export function EditProductModal({ product, onClose, onSaved }: EditProductModalProps) {
  if (!product) {
    return null;
  }

  return (
    <Modal isOpen={product !== null} onClose={onClose} title={`Edit ${product.name}`}>
      <ProductForm
        submitLabel="Save changes"
        initialValues={{
          name: product.name,
          price: String(product.price),
          stock: String(product.stock),
        }}
        onSubmit={(input) => productsApi.update(product.id, input)}
        onSuccess={() => {
          onSaved();
          onClose();
        }}
      />
    </Modal>
  );
}
