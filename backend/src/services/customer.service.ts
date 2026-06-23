import * as customerRepository from '../repositories/customer.repository';
import { NotFoundError, ValidationError } from '../errors';
import type { Customer } from '../types/customer';
import type { CreateCustomerInput, UpdateCustomerInput } from '../validators/customer.validators';

/**
 * Customer business logic. This is the reference slice — the Product slice follows
 * exactly these patterns. Services orchestrate repositories, enforce business
 * rules, and throw typed `AppError`s; they never touch SQLite or format HTTP.
 */

export function createCustomer(input: CreateCustomerInput): Customer {
  if (customerRepository.findByEmail(input.email)) {
    throw new ValidationError({ email: 'A customer with this email already exists' });
  }
  return customerRepository.create(input);
}

export function listCustomers(): Customer[] {
  return customerRepository.findAll();
}

export function getCustomerById(id: number): Customer {
  const customer = customerRepository.findById(id);
  if (!customer) {
    throw new NotFoundError(`Customer ${id} not found`);
  }
  return customer;
}

export function updateCustomer(id: number, input: UpdateCustomerInput): Customer {
  // Ensure the customer exists before attempting the update.
  getCustomerById(id);

  if (input.email) {
    const existing = customerRepository.findByEmail(input.email);
    if (existing && existing.id !== id) {
      throw new ValidationError({ email: 'A customer with this email already exists' });
    }
  }

  return customerRepository.update(id, input) as Customer;
}

export function deleteCustomer(id: number): void {
  const deleted = customerRepository.deleteById(id);
  if (!deleted) {
    throw new NotFoundError(`Customer ${id} not found`);
  }
}
