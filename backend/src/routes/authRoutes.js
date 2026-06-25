import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} from '../utils/validators.js';

const router = Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  authController.changePassword
);

export default router;
