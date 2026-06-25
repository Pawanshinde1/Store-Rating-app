import { Router } from 'express';
import * as storeController from '../controllers/storeController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createStoreValidation } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', storeController.getStores);
router.get('/my-store', authorize('STORE_OWNER'), storeController.getOwnedStore);
router.get('/:id/ratings', authorize('STORE_OWNER'), storeController.getStoreRatings);
router.get('/:id', storeController.getStoreById);

router.post(
  '/',
  authorize('ADMIN'),
  createStoreValidation,
  validate,
  storeController.createStore
);

export default router;
