import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createUserValidation } from '../utils/validators.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.post('/', createUserValidation, validate, userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

export default router;
