import UsersModel from '@models/users.model';
import TransactionRecord from '@models/transaction.model';
import dayjs from 'dayjs';
import TransactionModel from '@models/transaction.model';
import constants from '@/config/constants';
import * as console from 'console';
import { logger } from '@utils/logger';

class TransactionService {
  public async getActiveSessionForUser(user: UsersModel) {
    try {
      const lastTransaction = await TransactionRecord.findOne({
        where: {
          user_id: user.id,
          type: 'withdraw',
        },
        order: [['createdAt', 'DESC']],
        limit: 1,
      });

      if (
        lastTransaction &&
        dayjs(lastTransaction.startTime)
          .add(dayjs.duration({ seconds: lastTransaction.duration }))
          .isAfter(new Date())
      ) {
        return lastTransaction;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async getActiveSession() {
    const lastTransaction = await TransactionRecord.findOne({
      where: {
        type: 'withdraw',
      },
      order: [['createdAt', 'DESC']],
      limit: 1,
    });

    if (
      lastTransaction &&
      dayjs(lastTransaction.startTime)
        .add(dayjs.duration({ seconds: lastTransaction.duration }))
        .isAfter(new Date())
    ) {
      return lastTransaction;
    }
    return null;
  }

  public async extendCurrentSession(transaction: TransactionModel) {
    const durationSinceStart = Date.now() - transaction.startTime.getTime();
    transaction.duration = Math.ceil(durationSinceStart / 1000 + constants.session_reservation_time);
    return transaction.save();
  }

  public async endCurrentSession(transaction: TransactionModel) {
    const durationSinceStart = Date.now() - transaction.startTime.getTime();
    transaction.duration = Math.ceil(Math.max(constants.minimal_duration_charged, durationSinceStart / 1000));
    return transaction.save();
  }
}

export default TransactionService;
