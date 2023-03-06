import { Response } from 'express';
import { logger } from '@utils/logger';
import TransactionService from '@services/transaction.service';
import constants from '@/config/constants';
import creditService from '@services/credit.service';
import usersService from '@services/users.service';
import statusService from "@services/status.service";

class SseService {
  private timeout: any;
  private transactionService = new TransactionService();

  private clients: {
    user_id: number;
    response: Response;
  }[] = [];

  constructor() {
    setInterval(()=>{
      this._sendState().catch(e => logger.warn(e));
    }, 30 * 1000)
  }

  public registerClient(user_id: number, response: Response) {
    this.clients = this.clients.filter(c => c.user_id !== user_id);
    this.clients.push({ user_id, response });
  }

  public unregisterClient(user_id: number) {
    this.clients = this.clients.filter(c => c.user_id === user_id);
  }

  public sendMessageToUser(user_id: number, data: any) {
    const client = this.clients.find(c => c.user_id === user_id);

    if (client) {
      try {
        client.response.write(`data: ${JSON.stringify(data)}\n\n`);
        client.response.flush();
      } catch (e) {
        logger.warn(`could not send sse to user ${client.user_id}`);
      }
    }
  }

  public sendMessageToAll(data: any) {
    this.clients.forEach(client => {
      try {
        client.response.write(`data: ${JSON.stringify(data)}\n\n`);
        client.response.flush();
      } catch (e) {
        logger.warn(`could not send sse to user ${client.user_id}`);
      }
    });
  }

  public getRegisteredUsers() {
    return this.clients.map(client => client.user_id);
  }

  public async sendState() {
    await this._sendState();

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this._sendState();
    }, 1000 * constants.minimal_duration_charged + 1000);
  }

  private async _sendState() {
    const session = await this.transactionService.getActiveSession();
    const users = sseService.getRegisteredUsers();
    for (const user_id of users) {
      sseService.sendMessageToUser(user_id, {
        type: 'state',
        enabled: statusService.isEnabled(),
        inUse: !!session,
        inUseByCurrentUser: session ? session.user_id === user_id : false,

        total: await creditService.getCurrentCredit(user_id),
      });
    }
  }
}

const sseService = new SseService();

export default sseService;
