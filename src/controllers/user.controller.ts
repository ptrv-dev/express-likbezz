import { Request, Response } from 'express';

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

    const users = await UserModel.find()
      .populate('posts')
      .sort({ [sortBy || 'createdAt']: order })
      .limit(Number(limit) || 0);

    return res.status(200).json(users);
  } catch (error) {
    console.log(`[Error] Get all users error!\n\t${error}`);
    return res.status(500).json({ message: 'Get all users error 500' });
  }
}
