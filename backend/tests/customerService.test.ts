import { beforeEach, describe, expect, it } from 'vitest';
import * as customerService from '../src/services/customer.service';
import { NotFoundError } from '../src/errors';
import { resetDatabase } from './helpers/testDb';

const validCustomer = {
  name: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  phone: '+92 300 1234567',
};

describe('customerService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('createCustomer creates a customer and returns it with an id', () => {
    const customer = customerService.createCustomer(validCustomer);

    expect(customer.id).toBeGreaterThan(0);
    expect(customer.name).toBe(validCustomer.name);
    expect(customer.createdAt).toBeTruthy();
  });

  it('getCustomerById returns the requested customer', () => {
    const created = customerService.createCustomer(validCustomer);

    const found = customerService.getCustomerById(created.id);

    expect(found).toEqual(created);
  });

  it('getCustomerById throws NotFoundError for an unknown id', () => {
    expect(() => customerService.getCustomerById(9999)).toThrow(NotFoundError);
  });

  it('updateCustomer updates only the provided fields', () => {
    const created = customerService.createCustomer(validCustomer);

    const updated = customerService.updateCustomer(created.id, { phone: '+92 311 0000000' });

    expect(updated.phone).toBe('+92 311 0000000');
    expect(updated.name).toBe(validCustomer.name);
    expect(updated.email).toBe(validCustomer.email);
  });

  it('deleteCustomer removes the customer', () => {
    const created = customerService.createCustomer(validCustomer);

    customerService.deleteCustomer(created.id);

    expect(() => customerService.getCustomerById(created.id)).toThrow(NotFoundError);
  });
});
