import { body } from 'express-validator';

export const postCreateValidation = [
  body('image').optional().isString(),
  body('title').isLength({ min: 4, max: 128 }),
  body('text').isLength({ min: 10, max: 1024 }),
];
