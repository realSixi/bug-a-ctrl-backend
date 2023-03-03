import { Request } from 'express';
import UsersModel from '@models/users.model';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UsersModel;
}
