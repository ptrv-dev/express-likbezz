import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/UserModel';

export async function registration(req: Request, res: Response) {
  try {
    // check validation errors
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    // check duplicate
    const duplicate = await UserModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (duplicate)
      return res
        .status(400)
        .json({ message: 'Имя пользователя или E-Mail уже заняты.' });

    // generate password hash
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // create new user in db
    const newUser = await (
      await UserModel.create({
        username: req.body.username,
        password: passwordHash,
        email: req.body.email,
      })
    ).save();

    // generate jwt token
    const token = jwt.sign(newUser._id.toString(), process.env.JWT_SECRET!);

    // send user response with token in cookie
    res.cookie('token', token);
    return res.sendStatus(201);
  } catch (error) {
    console.log(`[Error] User registration error!\n\t${error}`);
    return res.status(500).json({ message: 'User registration error 500' });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const { _id, username, email, avatar, token } = req.user;
    return res.json({ _id, username, email, token, avatar });
  } catch (error) {
    console.log(`[Error] User getMe error!\n\t${error}`);
    return res.status(500).json({ message: 'User getMe error 500' });
  }
}

export async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  try {
    // validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    // get email and password from request
    const { email, password } = req.body;

    // find user by email
    const user = await UserModel.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ message: 'Email or password is incorrect.' });

    // check passwords match
    const passwordMatch = await bcrypt.compare(password, user.password!);
    if (!passwordMatch)
      return res
        .status(400)
        .json({ message: 'Email or password is incorrect.' });

    // generate token
    const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET!);

    // return user response with token in cookie
    return res.cookie('token', token).sendStatus(200);
  } catch (error) {
    console.log(`[Error] User login error!\n\t${error}`);
    return res.status(500).json({ message: 'User login error 500' });
  }
}

// export async function sample(req: Request, res: Response) {
//   return res.json({ message: 'Hello world!' });
// }
