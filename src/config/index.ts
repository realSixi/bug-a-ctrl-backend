import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  MQTT_SERVER,
  MQTT_PORT,
  MQTT_USER,
  MQTT_PASSWORD,
  MQTT_TOPICS,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  SESSION_RESERVATION_TIME,
  MINIMAL_DURATION_CHARGED,
} = process.env;
