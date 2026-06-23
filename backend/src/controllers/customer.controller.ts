import type { Request, Response } from 'express';
import * as customerService from '../services/customer.service';

/**
 * HTTP layer for customers: read the (already-validated) request, call the
 * service, and format the response. Controllers contain no business logic and
 * never access the database directly.
 */

export function createCustomer(req: Request, res: Response): void {
  const customer = customerService.createCustomer(req.body);
  res.status(201).json(customer);
}

export function listCustomers(_req: Request, res: Response): void {
  res.json(customerService.listCustomers());
}

export function getCustomer(req: Request, res: Response): void {
  const customer = customerService.getCustomerById(Number(req.params.id));
  res.json(customer);
}

export function updateCustomer(req: Request, res: Response): void {
  const customer = customerService.updateCustomer(Number(req.params.id), req.body);
  res.json(customer);
}

export function deleteCustomer(req: Request, res: Response): void {
  customerService.deleteCustomer(Number(req.params.id));
  res.status(204).send();
}
