import { body } from 'express-validator';

export const registrationValidation = [
  body('email').isEmail(),
  body('username').isLength({ min: 4, max: 64 }),
  body('password').isLength({ min: 8, max: 128 }),
];
