import { Router } from 'express';
// import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';
import BugAControlController from '@controllers/controlapi.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { IgniteDTO, MoveDTO } from '@dtos/bugacontrol.dto';
import authMiddleware from '@middlewares/auth.middleware';

class BugAControlRoute implements Routes {
  public path = '/api/bugacontrol';
  public router = Router();
  public indexController = new BugAControlController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/ignite`, authMiddleware, validationMiddleware(IgniteDTO, 'body'), this.indexController.ignite);
    this.router.post(`${this.path}/move`, authMiddleware, validationMiddleware(MoveDTO, 'body'), this.indexController.move);
  }
}

export default BugAControlRoute;
