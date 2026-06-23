import { db } from '../db/connection';
import type { Customer } from '../types/customer';
import type { CreateCustomerInput, UpdateCustomerInput } from '../validators/customer.validators';

/**
 * All SQLite access for customers lives here. Services call these functions and
 * never write SQL themselves.
 */

const insertStatement = db.prepare(
  `INSERT INTO customers (name, email, phone) VALUES (@name, @email, @phone)`,
);
const findAllStatement = db.prepare(`SELECT * FROM customers ORDER BY createdAt DESC, id DESC`);
const findByIdStatement = db.prepare(`SELECT * FROM customers WHERE id = ?`);
const findByEmailStatement = db.prepare(`SELECT * FROM customers WHERE email = ?`);
const deleteStatement = db.prepare(`DELETE FROM customers WHERE id = ?`);

export function create(input: CreateCustomerInput): Customer {
  const result = insertStatement.run(input);
  return findById(Number(result.lastInsertRowid)) as Customer;
}

export function findAll(): Customer[] {
  return findAllStatement.all() as Customer[];
}

export function findById(id: number): Customer | undefined {
  return findByIdStatement.get(id) as Customer | undefined;
}

export function findByEmail(email: string): Customer | undefined {
  return findByEmailStatement.get(email) as Customer | undefined;
}

export function update(id: number, fields: UpdateCustomerInput): Customer | undefined {
  const keys = Object.keys(fields) as (keyof UpdateCustomerInput)[];
  if (keys.length > 0) {
    const assignments = keys.map((key) => `${key} = @${key}`).join(', ');
    db.prepare(`UPDATE customers SET ${assignments} WHERE id = @id`).run({ ...fields, id });
  }
  return findById(id);
}

export function deleteById(id: number): boolean {
  return deleteStatement.run(id).changes > 0;
}
