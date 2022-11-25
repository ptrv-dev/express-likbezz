import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import CommentModel from '../models/CommentModel';
import PostModel from '../models/PostModel';

export async function create(req: Request, res: Response) {
  try {
    // validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    // check post exists
    const post = await PostModel.findById(req.body.post);
    if (!post) return res.status(404).json({ message: "Post doesn't exists" });

    // create new comment
    const newComment = await (
      await CommentModel.create({
        author: req.user._id,
        post: req.body.post,
        text: req.body.text,
      })
    ).save();

    // push comment id to array in post
    await post.updateOne({ $push: { comments: newComment._id } });

    await newComment.populate('author', 'username avatar');
    // return new comment to user
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(`[Error] Comment create error!\n\t${error}`);
    return res.status(500).json({ message: 'Comment create error 500' });
  }
}
