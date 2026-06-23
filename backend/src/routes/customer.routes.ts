import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { validateRequest } from '../middleware/validateRequest';
import { idParamSchema } from '../validators/common.validators';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../validators/customer.validators';

export const customerRouter = Router();

customerRouter.get('/', customerController.listCustomers);
customerRouter.post('/', validateRequest(createCustomerSchema), customerController.createCustomer);
customerRouter.get('/:id', validateRequest(idParamSchema, 'params'), customerController.getCustomer);
customerRouter.patch(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateCustomerSchema),
  customerController.updateCustomer,
);
customerRouter.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  customerController.deleteCustomer,
);
