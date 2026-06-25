import { Router } from 'express';
import * as ratingController from '../controllers/ratingController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { ratingValidation } from '../utils/validators.js';
import { body } from 'express-validator';

const router = Router();

router.use(authenticate, authorize('USER'));

router.get('/', ratingController.getUserRatings);
router.post('/', [body('storeId').isUUID(), ratingValidation], validate, ratingController.submitRating);
router.get('/:storeId', ratingController.getUserRating);
router.put('/:storeId', ratingValidation, validate, ratingController.updateRating);

export default router;
