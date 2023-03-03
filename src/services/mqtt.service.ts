import mqtt from 'mqtt';
import { MQTT_PASSWORD, MQTT_PORT, MQTT_SERVER, MQTT_TOPICS, MQTT_USER } from '@config';
import { log } from 'winston';
import { logger } from '@utils/logger';
import { BuyTimeMessage } from '@interfaces/mqtt.interfaces';
import creditService from '@services/credit.service';
import User from '@models/users.model';
import usersService from '@services/users.service';
import twitchService from '@services/twitch.service';
import dayjs from 'dayjs';
import sseService from '@services/sse.service';

class MqttService {
  client = null;

  constructor() {
    this.initClient();
  }

  public setupMqtt() {
    this.client.on('connect', () => {
      logger.info('MQTT Connected');
      this.client.subscribe('bugactrl/#', err => {
        if (!err) {
          logger.info('MQTT Subscribed');
        }
      });
    });

    this.client.on('message', (topic, payload, packet) => {
      try {
        const json = JSON.parse(payload.toString());
        switch (json.type) {
          case 'BUY_TIME': {
            this.handleBuyTime(json as BuyTimeMessage);
          }
        }
      } catch (e) {
        logger.warn(`failed to parse mqtt message ${topic} / ${payload}`);
      }
    });
  }

  private async handleBuyTime(message: BuyTimeMessage) {
    logger.info(`charge`, message);

    const user = await usersService.findOrCreate(Number.parseInt(message.user_id));
    await creditService.rechargeAmount(user, dayjs.duration(message.duration).asSeconds(), dayjs(message.created).toDate());

    sseService.sendMessageToUser(Number.parseInt(message.user_id), {
      type: 'charged',
      charged: dayjs.duration(message.duration).asSeconds(),
      total: await creditService.getCurrentCredit(user.id),
    });
  }

  private initClient() {
    this.client = mqtt.connect(`mqtts://${MQTT_SERVER}`, {
      username: MQTT_USER,
      password: MQTT_PASSWORD,
      port: Number.parseInt(MQTT_PORT),
      reconnectPeriod: 1000,
    });
  }

  public sendBugAControlMessage(user_id, username, joint_a, joint_b, joint_c, vertical_axis) {
    this.client.publish(
      'bugactrl/switchtime',
      JSON.stringify({
        created: new Date(),
        user_id,
        username,
        joint_a,
        joint_b,
        joint_c,
        vertical_axis,
      }),
    );
  }
}

const mqttService = new MqttService();

export default mqttService;
