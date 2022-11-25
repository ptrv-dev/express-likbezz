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
    {
      limit: string;
      sortBy: string;
      order: 'asc' | 'desc';
      dateFrom: string;
      dateTo: string;
    }
  >,
  res: Response
) {
  try {
    const { limit, sortBy, order, dateFrom, dateTo } = req.query;

    let customDateFrom, customDateTo, startDate, endDate;
    if (dateFrom) {
      customDateFrom = dateFrom
        .split('.')
        .map((item) => Number(item))
        .reverse();

      if (dateTo) {
        customDateTo = dateTo
          .split('.')
          .map((item) => Number(item))
          .reverse();
      }

      startDate = new Date(customDateFrom.join(','));
      endDate = new Date(customDateTo ? customDateTo.join(',') : new Date());
    }

    const posts = await PostModel.find({
      [dateFrom && 'createdAt']: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate('author', 'avatar username email')
      .sort({ [sortBy || 'views']: order })
      .limit(Number(limit || 0))
      .exec();

    return res.json(
      posts.map((post) => {
        return Object.assign(post.toObject(), {
          likes: Array.from(post.likes),
          dislikes: Array.from(post.dislikes),
        });
      })
    );
  } catch (error) {
    console.log(`[Error] Get Posts error!\n\t${error}`);
    return res.status(500).json({ message: 'Get Posts error 500' });
  }
}

export async function getOne(req: Request<{ postId: string }>, res: Response) {
  try {
    // get post id from params
    const { postId } = req.params;

    // get post from db and check exists
    const post = await PostModel.findByIdAndUpdate(postId, {
      $inc: { views: 1 },
    })
      .populate('author', 'avatar username email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'avatar username' },
      });
    if (!post) return res.status(404).json({ message: "Post doesn't exists" });

    // return to user selected post
    return res.json(
      Object.assign(post.toObject(), {
        likes: Array.from(post.likes),
        dislikes: Array.from(post.dislikes),
      })
    );
  } catch (error) {
    console.log(`[Error] Get one post error!\n\t${error}`);
    return res.status(500).json({ message: 'Get one post error 500' });
  }
}

export async function like(req: Request, res: Response) {
  try {
    // get post id from params
    const { postId } = req.params;

    // get post from db and check exists
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post doesn't exists" });

    // if user already liked post => remove like
    if (post.likes.has(req.user._id)) post.likes.delete(req.user._id);
    // else set like and remove dislike
    else {
      post.likes.set(req.user._id.toString(), true);
      post.dislikes.delete(req.user._id);
    }

    // save updated post
    await post.save();

    // return user new likes and dislikes
    return res.json({
      likes: Array.from(post.likes),
      dislikes: Array.from(post.dislikes),
    });
  } catch (error) {
    console.log(`[Error] Like post error!\n\t${error}`);
    return res.status(500).json({ message: 'Like post error 500' });
  }
}

export async function dislike(req: Request, res: Response) {
  try {
    // get post id from params
    const { postId } = req.params;

    // get post from db and check exists
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post doesn't exists" });

    // if user already disliked post => remove dislike
    if (post.dislikes.has(req.user._id)) post.dislikes.delete(req.user._id);
    // else set dislike and remove like
    else {
      post.dislikes.set(req.user._id.toString(), true);
      post.likes.delete(req.user._id);
    }

    // save updated post
    await post.save();

    // return user new likes and dislikes
    return res.json({
      likes: Array.from(post.likes),
      dislikes: Array.from(post.dislikes),
    });
  } catch (error) {
    console.log(`[Error] Like post error!\n\t${error}`);
    return res.status(500).json({ message: 'Like post error 500' });
  }
}
