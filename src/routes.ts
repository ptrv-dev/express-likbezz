import { Express } from 'express';

import * as AuthController from './controllers/auth.controller';

import { verifyToken } from './middlewares/verifyToken';

import { registrationValidation } from './validations/auth.validation';

export default function (app: Express) {
  app.post(
    '/auth/registration',
    registrationValidation,
    AuthController.registration
  );
  app.get('/auth/me', verifyToken, AuthController.getMe);
}
