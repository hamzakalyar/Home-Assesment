import { db } from './connection';
import { resetSchema } from './schema';
import { withTransaction } from './transaction';
import * as customerRepository from '../repositories/customer.repository';
import * as productRepository from '../repositories/product.repository';
import type { CreateCustomerInput } from '../validators/customer.validators';
import type { CreateProductInput } from '../validators/product.validators';

const customers: CreateCustomerInput[] = [
  { name: 'Ayesha Khan', email: 'ayesha.khan@example.com', phone: '+92 300 1234567' },
  { name: 'Bilal Ahmed', email: 'bilal.ahmed@example.com', phone: '+92 301 2345678' },
  { name: 'Fatima Noor', email: 'fatima.noor@example.com', phone: '+92 302 3456789' },
  { name: 'Hassan Raza', email: 'hassan.raza@example.com', phone: '+92 303 4567890' },
  { name: 'Sana Malik', email: 'sana.malik@example.com', phone: '+92 304 5678901' },
];

const products: CreateProductInput[] = [
  { name: 'Mechanical Keyboard', price: 89.99, stock: 24 },
  { name: 'Wireless Mouse', price: 29.5, stock: 60 },
  { name: 'USB-C Hub', price: 45.0, stock: 12 },
  { name: '27-inch Monitor', price: 219.99, stock: 7 },
  { name: 'Laptop Stand', price: 34.75, stock: 0 },
  { name: 'Noise-Cancelling Headphones', price: 159.99, stock: 3 },
  { name: 'Webcam 1080p', price: 54.25, stock: 18 },
  { name: 'Desk Lamp', price: 22.0, stock: 40 },
];

/** Recreates the schema and inserts a fresh, deterministic data set. */
function seed(): void {
  resetSchema(db);

  withTransaction(() => {
    for (const customer of customers) {
      customerRepository.create(customer);
    }
    for (const product of products) {
      productRepository.create(product);
    }
  });

  console.log(`Seeded ${customers.length} customers and ${products.length} products.`);
}

seed();
