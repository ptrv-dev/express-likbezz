import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import UserModel from '../models/UserModel';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get token from cookie
    const token = req.cookies.token;

    // check token exists
    if (!token) return res.status(401).json({ message: 'Access denied.' });

    // decode token
    const _id = jwt.verify(token, process.env.JWT_SECRET!);

    // find user by id
    const user = await UserModel.findById(_id);

    // check user exists
    if (!user)
      return res
        .cookie('token', '')
        .status(404)
        .json({ message: 'Incorrect token.' });

    // insert into request user info
    req.user = {
      _id: user._id.toString(),
      email: user.email!,
      avatar: user.avatar,
      username: user.username!,
      token: token,
    };

    // go next
    next();
  } catch (error) {
    console.log(`[Error] Verify token error!\n\t${error}`);
    return res.status(500).json({ message: 'Verify token error 500' });
  }
}
