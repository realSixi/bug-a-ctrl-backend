import UsersModel from '@models/users.model';
import { NextFunction, Request, Response } from 'express';
import usersService from '@services/users.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import creditService from '@services/credit.service';

class UserController {
  public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {

      const user = req.user as UsersModel;
      const currentCredits = await creditService.getCurrentCredit(req.user.id);
      const result = {
        id: user.id,
        username: user.username,
        apikey: user.apikey,
        credit: {
          currentCredits,
        },
      };

      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default UserController;
