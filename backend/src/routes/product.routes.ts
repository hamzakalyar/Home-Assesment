import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateRequest } from '../middleware/validateRequest';
import { idParamSchema } from '../validators/common.validators';
import { createProductSchema, updateProductSchema } from '../validators/product.validators';

export const productRouter = Router();

productRouter.get('/', productController.listProducts);
productRouter.post('/', validateRequest(createProductSchema), productController.createProduct);
productRouter.get('/:id', validateRequest(idParamSchema, 'params'), productController.getProduct);
productRouter.patch(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateProductSchema),
  productController.updateProduct,
);
productRouter.delete(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  productController.deleteProduct,
);

// TASK B — wire the stock-adjustment endpoint here, e.g.:
//   productRouter.post(
//     '/:id/adjust-stock',
//     validateRequest(idParamSchema, 'params'),
//     validateRequest(adjustStockSchema),
//     productController.adjustStock,
//   );
// See the README for the full specification.
