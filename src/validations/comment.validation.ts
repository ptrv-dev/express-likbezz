import { body } from 'express-validator';

export const commentCreateValidation = [
  body('post').isString(),
  body('text').isLength({ min: 2, max: 1024 }),
];
