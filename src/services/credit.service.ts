import UsersModel from '@models/users.model';
import { logger } from '@utils/logger';
import TransactionRecord from '@models/transaction.model';

class CreditService {
  public async rechargeAmount(user: UsersModel, duration: number, created?: Date) {
    try {
      await user.createTransactionRecord({
        type: 'charge',
        duration: duration,
        startTime: created || new Date(),
        createdAt: created || new Date(),
      });
    } catch (e) {
      logger.warn(e);
    }
  }

  public async withdrawAmount(user: UsersModel, duration: number) {
    await user.createTransactionRecord({
      type: 'withdraw',
      duration: duration,
      startTime: new Date(),
    });
  }

  public async getCurrentCredit(user_id: number) {
    const creditTotal = await TransactionRecord.sum('duration', {
      where: {
        user_id: user_id,
        type: 'charge',
      },
    });

    const creditsUsed = await TransactionRecord.sum('duration', {
      where: {
        user_id: user_id,
        type: 'withdraw',
      },
    });

    return creditTotal - creditsUsed;
  }
}

const creditService = new CreditService();

export default creditService;
