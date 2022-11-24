import { Express, Request } from 'express';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
