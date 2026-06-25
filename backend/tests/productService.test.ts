import { beforeEach, describe, expect, it } from 'vitest';
import * as productService from '../src/services/product.service';
import { NotFoundError } from '../src/errors';
import { resetDatabase } from './helpers/testDb';

const validProduct = {
  name: 'Mechanical Keyboard',
  price: 89.99,
  stock: 24,
};

describe('productService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  // --- Already-implemented methods: these tests pass out of the box and show the
  // --- patterns to follow for Task A. Do not modify them.

  it('createProduct creates a product and returns it with an id', () => {
    const product = productService.createProduct(validProduct);

    expect(product.id).toBeGreaterThan(0);
    expect(product.name).toBe(validProduct.name);
    expect(product.price).toBe(validProduct.price);
    expect(product.stock).toBe(validProduct.stock);
  });

  it('getProductById returns the requested product', () => {
    const created = productService.createProduct(validProduct);

    expect(productService.getProductById(created.id)).toEqual(created);
  });

  it('getProductById throws NotFoundError for an unknown id', () => {
    expect(() => productService.getProductById(9999)).toThrow(NotFoundError);
  });

  it('listProducts returns every product', () => {
    productService.createProduct(validProduct);
    productService.createProduct({ name: 'Wireless Mouse', price: 29.5, stock: 60 });

    expect(productService.listProducts()).toHaveLength(2);
  });

  it('searchProducts matches names case-insensitively', () => {
    productService.createProduct(validProduct);
    productService.createProduct({ name: 'Wireless Mouse', price: 29.5, stock: 60 });

    const results = productService.searchProducts('keyboard');

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Mechanical Keyboard');
  });

  // --- TASK A: implement productService.updateProduct, then remove `.skip` from
  // --- the two tests below and make them pass.

  it('updateProduct updates only the provided fields', () => {
    const created = productService.createProduct(validProduct);

    const updated = productService.updateProduct(created.id, { price: 99.99 });

    expect(updated.price).toBe(99.99);
    expect(updated.name).toBe(validProduct.name);
    expect(updated.stock).toBe(validProduct.stock);
  });

  it('updateProduct throws NotFoundError for a nonexistent id', () => {
    expect(() => productService.updateProduct(9999, { price: 99.99 })).toThrow(NotFoundError);
  });
});
