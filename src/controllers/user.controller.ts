import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';

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
      { select: 'avatar username posts comments' }
    )
      .populate({
        path: 'posts',
        options: { sort: { ['views']: 'desc' }, limit: 4 },
      })
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

    return res.status(200).json(user);
  } catch (error) {
    console.log(`[Error] Get user posts error!\n\t${error}`);
    return res.status(500).json({ message: 'Get user posts error 500' });
  }
}
