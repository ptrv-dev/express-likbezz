import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import PostModel from '../models/PostModel';

export async function create(req: Request, res: Response) {
  try {
    // validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const newPost = await (
      await PostModel.create({
        author: req.user._id,
        title: req.body.title,
        text: req.body.text,
        image: req.body.image,
      })
    ).save();

    return res.status(200).json(newPost);
  } catch (error) {
    console.log(`[Error] Post create error!\n\t${error}`);
    return res.status(500).json({ message: 'Post create error 500' });
  }
}

export async function getAll(
  req: Request<
    {},
    {},
    {},
    { limit: string; sortBy: string; order: 'asc' | 'desc'; date: string }
  >,
  res: Response
) {
  try {
    const { limit = 0, sortBy = 'views', order = 'asc', date } = req.query;

    let customDate, startDate, endDate;
    if (date) {
      customDate = date
        .split('.')
        .map((item) => Number(item))
        .reverse();

      startDate = new Date(customDate.join(','));
      endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
    }

    const posts = await PostModel.find({
      [date && 'createdAt']: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate('author', 'avatar username email')
      .sort({ [sortBy]: order })
      .limit(Number(limit))
      .exec();
    return res.json(posts);
  } catch (error) {
    console.log(`[Error] Get Posts error!\n\t${error}`);
    return res.status(500).json({ message: 'Get Posts error 500' });
  }
}
