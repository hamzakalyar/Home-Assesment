import * as productRepository from '../repositories/product.repository';
import { NotFoundError, AppError } from '../errors';
import type { Product } from '../types/product';
import type { CreateProductInput, UpdateProductInput, AdjustStockInput } from '../validators/product.validators';
import { withTransaction } from '../db/transaction';


/**
 * Product business logic.
 *
 * Most methods below are fully implemented and serve as worked examples of the
 * conventions used across the codebase — study them before starting Task A. The
 * `updateProduct` method is intentionally left unimplemented for you to complete.
 */

export function createProduct(input: CreateProductInput): Product {
  return productRepository.create(input);
}

export function getProductById(id: number): Product {
  const product = productRepository.findById(id);
  if (!product) {
    throw new NotFoundError(`Product ${id} not found`);
  }
  return product;
}

export function listProducts(): Product[] {
  return productRepository.findAll();
}

export function searchProducts(query: string): Product[] {
  return productRepository.search(query);
}

export function deleteProduct(id: number): void {
  const deleted = productRepository.deleteById(id);
  if (!deleted) {
    throw new NotFoundError(`Product ${id} not found`);
  }
}

/**
 * TASK A — implement this method.
 *
 * Apply a partial update to an existing product: only the fields present in
 * `input` should change, and each provided field must satisfy the same rules as
 * on create (already enforced by `updateProductSchema`). Throw `NotFoundError` if
 * no product with the given id exists, and return the updated product.
 *
 * The `updateCustomer` method in customer.service.ts is the reference to follow.
 * After implementing, unskip the two tests in tests/productService.test.ts.
 */
export function updateProduct(id: number, input: UpdateProductInput): Product {
  // Ensure the product exists before attempting the update.
  getProductById(id);

  return productRepository.update(id, input) as Product;
}

export function adjustStock(id: number, input: AdjustStockInput): Product {
  return withTransaction(() => {
    const product = productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product ${id} not found`);
    }

    const newStock = product.stock + input.delta;
    if (newStock < 0) {
      const err = new (class extends AppError {
        constructor() {
          super('INSUFFICIENT_STOCK', 'Insufficient stock for this adjustment', 400);
        }
      })();
      throw err;
    }

    productRepository.updateStock(id, newStock);
    return productRepository.findById(id) as Product;
  });
}
