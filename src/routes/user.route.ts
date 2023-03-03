import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';

class UserRoute implements Routes {
  public path = '/api/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.userController.getCurrentUser);
  }
}

export default UserRoute;
