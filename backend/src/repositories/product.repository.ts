import { db } from '../db/connection';
import type { Product } from '../types/product';
import type { CreateProductInput, UpdateProductInput } from '../validators/product.validators';

/**
 * All SQLite access for products lives here. Services call these functions and
 * never write SQL themselves.
 */

const insertStatement = db.prepare(
  `INSERT INTO products (name, price, stock) VALUES (@name, @price, @stock)`,
);
const findAllStatement = db.prepare(`SELECT * FROM products ORDER BY createdAt DESC, id DESC`);
const findByIdStatement = db.prepare(`SELECT * FROM products WHERE id = ?`);
const searchStatement = db.prepare(
  `SELECT * FROM products WHERE LOWER(name) LIKE '%' || LOWER(?) || '%' ORDER BY name ASC`,
);
const deleteStatement = db.prepare(`DELETE FROM products WHERE id = ?`);

export function create(input: CreateProductInput): Product {
  const result = insertStatement.run(input);
  return findById(Number(result.lastInsertRowid)) as Product;
}

export function findAll(): Product[] {
  return findAllStatement.all() as Product[];
}

export function findById(id: number): Product | undefined {
  return findByIdStatement.get(id) as Product | undefined;
}

export function search(query: string): Product[] {
  return searchStatement.all(query) as Product[];
}

export function update(id: number, fields: UpdateProductInput): Product | undefined {
  const keys = Object.keys(fields) as (keyof UpdateProductInput)[];
  if (keys.length > 0) {
    const assignments = keys.map((key) => `${key} = @${key}`).join(', ');
    db.prepare(`UPDATE products SET ${assignments} WHERE id = @id`).run({ ...fields, id });
  }
  return findById(id);
}

export function deleteById(id: number): boolean {
  return deleteStatement.run(id).changes > 0;
}
