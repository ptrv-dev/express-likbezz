import { body } from 'express-validator';

export const userUpdateValidation = [
  body('avatar').optional().isString(),
  body('email').optional().isEmail(),
  body('username').optional().isLength({ min: 4, max: 64 }),
  body('currentPassword').optional().isLength({ min: 8, max: 128 }),
  body('newPassword').optional().isLength({ min: 8, max: 128 }),
];
