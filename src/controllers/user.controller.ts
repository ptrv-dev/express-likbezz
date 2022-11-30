import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserModel from '../models/UserModel';

export async function getAll(
  req: Request<
    {},
    {},
    {},
    { sortBy?: string; order?: 'asc' | 'desc'; limit?: string }
  >,
  res: Response
) {
  try {
    // get query params
    const { sortBy, order = 'desc', limit } = req.query;

    const users = await UserModel.find(
      {},
      {},
      { select: 'avatar username posts comments' }
    )
      .populate('posts')
      .sort({ [sortBy || 'createdAt']: order })
      .limit(Number(limit) || 0);

    return res.status(200).json(users);
  } catch (error) {
    console.log(`[Error] Get all users error!\n\t${error}`);
    return res.status(500).json({ message: 'Get all users error 500' });
  }
}

export async function getOne(req: Request<{ userId: string }>, res: Response) {
  try {
    // get user id from params
    const { userId } = req.params;

    const user = await UserModel.findById(
      userId,
      {},
      { select: 'avatar username posts comments email' }
    )
      .populate('posts')
      .populate('comments');

    return res.status(200).json(user);
  } catch (error) {
    console.log(`[Error] Get one user error!\n\t${error}`);
    return res.status(500).json({ message: 'Get one user error 500' });
  }
}

export async function getUserPosts(req: Request, res: Response) {
  try {
    // get user id from params
    const { userId } = req.params;

    const user = await UserModel.findById(
      userId,
      {},
      { populate: { path: 'posts' } }
    );
    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    return res.status(200).json(user.posts);
  } catch (error) {
    console.log(`[Error] Get user posts error!\n\t${error}`);
    return res.status(500).json({ message: 'Get user posts error 500' });
  }
}

export async function postFavorite(req: Request, res: Response) {
  try {
    // get user id from params
    const { postId } = req.params;

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    if (user.favorites.includes(postId as any)) {
      await user.updateOne({ $pull: { favorites: postId } });
    } else {
      await user.updateOne({ $push: { favorites: postId } });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(`[Error] Add post to favorite error!\n\t${error}`);
    return res.status(500).json({ message: 'Add post to favorite error 500' });
  }
}

export async function getUserFavorites(req: Request, res: Response) {
  try {
    // get user id from params
    const { userId } = req.params;

    const user = await UserModel.findById(userId).populate({
      path: 'favorites',
      populate: { path: 'author', select: 'avatar username' },
    });

    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    return res.status(200).json(user.favorites);
  } catch (error) {
    console.log(`[Error] Get user favorites error!\n\t${error}`);
    return res.status(500).json({ message: 'Get user favorites error 500' });
  }
}

export async function userUpdate(req: Request, res: Response) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    let newPassword;

    if (req.body.newPassword) {
      if (!req.body.currentPassword)
        return res
          .status(400)
          .json({ message: 'Current password is not specified.' });
      const passwordMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!passwordMatch)
        return res.status(400).json({ message: 'Incorrect current password' });
      newPassword = await bcrypt.hash(req.body.newPassword, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
        username: req.body.username,
        email: req.body.email,
        password: newPassword,
      },
      { returnDocument: 'after' }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(`[Error] User update error!\n\t${error}`);
    return res.status(500).json({ message: 'User update error 500' });
  }
}
