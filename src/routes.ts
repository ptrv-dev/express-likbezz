import { Express } from 'express';
import { upload } from './app';

import * as AuthController from './controllers/auth.controller';
import * as PostController from './controllers/post.controller';
import * as UploadController from './controllers/upload.controller';
import * as CommentController from './controllers/comment.controller';
import * as UserController from './controllers/user.controller';

import { verifyToken } from './middlewares/verifyToken';

import {
  loginValidation,
  registrationValidation,
} from './validations/auth.validation';
import { postCreateValidation } from './validations/post.validation';
import { commentCreateValidation } from './validations/comment.validation';

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
  app.get('/post/:postId', PostController.getOne);
  app.patch('/post/:postId/like', verifyToken, PostController.like);
  app.patch('/post/:postId/dislike', verifyToken, PostController.dislike);

  app.get('/users', UserController.getAll);
  app.get('/users/:userId', UserController.getOne);
  app.get('/users/:userId/posts', UserController.getUserPosts);
  app.post('/users/favorite/:postId', verifyToken, UserController.postFavorite);
  app.get('/users/:userId/favorites', UserController.getUserFavorites);

  app.post(
    '/comment',
    verifyToken,
    commentCreateValidation,
    CommentController.create
  );
  app.delete('/comment/:commentId', verifyToken, CommentController.remove);

  app.post(
    '/upload',
    verifyToken,
    upload.single('image'),
    UploadController.fileUpload
  );
}
