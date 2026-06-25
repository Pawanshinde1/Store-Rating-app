import { body } from 'express-validator';

export const nameValidation = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

export const addressValidation = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters');

export const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

export const passwordValidation = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
  .withMessage('Password must contain at least one special character');

export const ratingValidation = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be between 1 and 5');

export const registerValidation = [
  nameValidation,
  emailValidation,
  addressValidation.optional({ nullable: true }),
  passwordValidation,
];

export const loginValidation = [
  emailValidation,
  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
    .withMessage('New password must contain at least one special character')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password'),
];

export const createUserValidation = [
  nameValidation,
  emailValidation,
  addressValidation.optional({ nullable: true }),
  passwordValidation,
  body('role')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),
];

export const createStoreValidation = [
  nameValidation,
  emailValidation,
  addressValidation,
  body('ownerId').isUUID().withMessage('Valid owner ID is required'),
];
