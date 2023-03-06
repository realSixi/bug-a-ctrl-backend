import UsersModel from '@models/users.model';
import {logger} from '@utils/logger';
import creditService from '@services/credit.service';
import MqttService from '@services/mqtt.service';
import TransactionService from '@services/transaction.service';
import constants from '@/config/constants';
import {HttpException} from '@exceptions/HttpException';
import sseService from '@services/sse.service';
import dayjs from 'dayjs';
import Constants from "@/config/constants";
import StatusService from "@services/status.service";

class BugacontrolService {
  private mqttService = MqttService;
  private transactionService = new TransactionService();
  private statusService = StatusService;

  public async ignite(user: UsersModel) {
    if (!this.statusService.isEnabled()) {
      throw new HttpException(403, 'api is currently disabled');
    }

    const activeSession = await this.transactionService.getActiveSession();
    if (activeSession !== null && activeSession.user_id !== user.id) {
      throw new HttpException(409, 'already in use by another user!');
    }

    const currentCredit = await creditService.getCurrentCredit(user.id);

    if (currentCredit < Constants.session_reservation_time) {
      await sseService.sendState();
      await this.mqttService.sendIgnite(user.id, user.username, false);
      throw new HttpException(403, `insufficient credits, only ${currentCredit} left.`)
    }
    console.log('currentCredit', currentCredit);

    const activeSessionUser = await this.transactionService.getActiveSessionForUser(user);
    if (activeSessionUser) {
      await this.transactionService.extendCurrentSession(activeSession);
      console.log('current section extended!');

      await sseService.sendState();
      return;
    }

    await creditService.withdrawAmount(user, constants.session_reservation_time);
    await sseService.sendState();
    await this.mqttService.sendIgnite(user.id, user.username, true);
  }

  public async unignite(user: UsersModel) {
    const activeSession = await this.transactionService.getActiveSessionForUser(user);
    if (!activeSession) {
      throw new HttpException(409, 'not ignited');
    }

    const endedSession = await this.transactionService.endCurrentSession(activeSession);
    const endIn = dayjs(endedSession.startTime).add(dayjs.duration(endedSession.duration * 1000));
    logger.info(`currentSession // END IND ${endIn} /// ${endedSession.duration} / ${endedSession.startTime}`);
    logger.info(`send notification in ${endIn.diff(dayjs())}`);
    setTimeout(async () => {
      await sseService.sendState();
    }, Math.max(0, endIn.diff(dayjs())) + 500);

    await this.mqttService.sendIgnite(user.id, user.username, false);
  }

  public async move(move: { joint_a: number; joint_b: number; joint_c: number; vertical_axis: number }, user: UsersModel) {
    if (!this.statusService.isEnabled()) {
      throw new HttpException(403, 'api is currently disabled');
    }

    const currentSession = await this.transactionService.getActiveSessionForUser(user);
    if (!currentSession) {
      logger.warn(`user ${user.id} has no active session!`);
      throw new HttpException(403, 'not ignited for current user!');
    }

    this.mqttService.sendBugAControlMessage(user.id, user.username, move.joint_a, move.joint_b, move.joint_c, move.vertical_axis);

    logger.info(`service move ${JSON.stringify(move)} / ${user}`);
  }
}

export default BugacontrolService;
