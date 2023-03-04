import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import TransactionService from '@services/transaction.service';
import transactionService from '@services/transaction.service';
import sseService from '@services/sse.service';
import { logger } from '@utils/logger';
import creditService from '@services/credit.service';
import statusService from "@services/status.service";

class UserController {
  private transactionService = new TransactionService();
  public getStatus = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activeSession = await this.transactionService.getActiveSession();
      const result = {
        enabled: statusService.isEnabled(),
        inUse: activeSession !== null,
        inUseByCurrentUser: activeSession ? activeSession.user_id === req.user.id : false,
        total: await creditService.getCurrentCredit(req.user.id),
      };

      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  public getStatusSSE = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    };

    res.writeHead(200, headers);
    sseService.registerClient(req.user.id, res);

    req.on('close', () => {
      logger.info(`sse closed for user ${req.user.id}`);
      sseService.unregisterClient(req.user.id);
    });
  };
}

export default UserController;
