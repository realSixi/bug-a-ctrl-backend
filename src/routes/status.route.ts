import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import UserController from '@controllers/user.controller';
import StatusController from '@controllers/status.controller';

class UserRoute implements Routes {
  public path = '/api/bugacontrol/status';
  public router = Router();
  public statusController = new StatusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.statusController.getStatus);
    this.router.get(`${this.path}/subscribe`, authMiddleware, this.statusController.getStatusSSE);
  }
}

export default UserRoute;
