import { NextFunction, Request, Response } from 'express';
import { IgniteDTO, MoveDTO } from '@dtos/bugacontrol.dto';
import BugacontrolService from '@services/bugacontrol.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import TransactionService from '@services/transaction.service';

class BugAControlController {
  private bugacontrolService: BugacontrolService;

  constructor() {
    this.bugacontrolService = new BugacontrolService();
  }

  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      // res.sendStatus(200);
      res
        .json({
          hello: 'World!',
        })
        .status(200);
    } catch (error) {
      next(error);
    }
  };

  public ignite = async (req: RequestWithUser, res: Response, next: NextFunction): void => {
    try {
      const dto: IgniteDTO = req.body;
      if (dto.on) {
        try {
          await this.bugacontrolService.ignite(req.user);
        } catch (e) {
          next(e);
          return;
        }
      } else {
        await this.bugacontrolService.unignite(req.user);
      }
      res.status(200).json({ status: 'OK' });
    } catch (e) {
      next(e);
    }
  };

  public move = async (req: RequestWithUser, res: Response, next: NextFunction): void => {
    const dto: MoveDTO = req.body;

    try {
      await this.bugacontrolService.move(dto, req.user);
    } catch (e) {
      next(e);
      return;
    }

    res.status(200).json({ status: 'OK' });
  };
}

export default BugAControlController;
