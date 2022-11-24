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

export async function getAll(req: Request, res: Response) {
  try {
    const posts = await PostModel.find().populate(
      'author',
      'avatar username email'
    );
    return res.json(posts);
  } catch (error) {
    console.log(`[Error] Post create error!\n\t${error}`);
    return res.status(500).json({ message: 'Post create error 500' });
  }
}
