import { Router } from 'express';
import { customerRouter } from './customer.routes';
import { productRouter } from './product.routes';

/** Aggregates all resource routers under the `/api` namespace. */
export const apiRouter = Router();

apiRouter.use('/customers', customerRouter);
apiRouter.use('/products', productRouter);
