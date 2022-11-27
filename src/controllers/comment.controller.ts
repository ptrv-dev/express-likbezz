import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import CommentModel from '../models/CommentModel';
import PostModel from '../models/PostModel';
import UserModel from '../models/UserModel';

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
    // push comment id to array in user
    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: { comments: newComment._id },
    });

    await newComment.populate('author', 'username avatar');
    // return new comment to user
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(`[Error] Comment create error!\n\t${error}`);
    return res.status(500).json({ message: 'Comment create error 500' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    //
    // get comment id from query
    const { commentId } = req.params;

    // get comment from db and exists check
    const comment = await CommentModel.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment doesn't exists" });

    // check is user author of comment
    if (String(req.user._id) !== String(comment.author))
      return res.status(401).json({ message: 'Access denied.' });

    // delete comment from db and array in post and user
    await comment.deleteOne();
    await PostModel.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { comments: comment._id },
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log(`[Error] Comment remove error!\n\t${error}`);
    return res.status(500).json({ message: 'Comment remove error 500' });
  }
}
