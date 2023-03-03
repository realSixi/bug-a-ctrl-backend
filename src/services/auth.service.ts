import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';

import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import usersService from '@services/users.service';
import UsersModel from '@models/users.model';

class AuthService {
  public async login(id: number): Promise<{ cookie: string; user: UsersModel }> {
    const user = await usersService.findById(id);

    if (!user) throw new HttpException(401, 'invalid user or user not found');

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user };
  }

  public async logout(userData: UsersModel): Promise<UsersModel> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: UsersModel = null;
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: UsersModel): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/;`;
  }
}

const authService = new AuthService();
export default authService;
