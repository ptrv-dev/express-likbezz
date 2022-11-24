import { Express } from 'express';
import { upload } from './app';

import * as AuthController from './controllers/auth.controller';
import * as PostController from './controllers/post.controller';
import * as UploadController from './controllers/upload.controller';

import { verifyToken } from './middlewares/verifyToken';

import {
  loginValidation,
  registrationValidation,
} from './validations/auth.validation';
import { postCreateValidation } from './validations/post.validation';

export default function (app: Express) {
  app.post(
    '/auth/registration',
    registrationValidation,
    AuthController.registration
  );
  app.get('/auth/me', verifyToken, AuthController.getMe);
  app.post('/auth/login', loginValidation, AuthController.login);

  app.post('/post', verifyToken, postCreateValidation, PostController.create);
  app.get('/post', PostController.getAll);

  app.post(
    '/upload',
    verifyToken,
    upload.single('image'),
    UploadController.fileUpload
  );
}
