import type { Request, Response } from 'express';
import * as productService from '../services/product.service';

/**
 * HTTP layer for products. Mirrors the customer controller. The list endpoint
 * dispatches to search when a `?search=` query string is provided.
 */

export function createProduct(req: Request, res: Response): void {
  const product = productService.createProduct(req.body);
  res.status(201).json(product);
}

export function listProducts(req: Request, res: Response): void {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const products = search ? productService.searchProducts(search) : productService.listProducts();
  res.json(products);
}

export function getProduct(req: Request, res: Response): void {
  const product = productService.getProductById(Number(req.params.id));
  res.json(product);
}

export function updateProduct(req: Request, res: Response): void {
  const product = productService.updateProduct(Number(req.params.id), req.body);
  res.json(product);
}

export function deleteProduct(req: Request, res: Response): void {
  productService.deleteProduct(Number(req.params.id));
  res.status(204).send();
}

export function adjustStock(req: Request, res: Response): void {
  const product = productService.adjustStock(Number(req.params.id), req.body);
  res.json(product);
}
