import {MINIMAL_DURATION_CHARGED, SESSION_RESERVATION_TIME} from "@/config/index";

const session_reservation_time = SESSION_RESERVATION_TIME ? Number.parseInt(SESSION_RESERVATION_TIME) : 20;
const minimal_duration_charged = MINIMAL_DURATION_CHARGED ? Number.parseInt(MINIMAL_DURATION_CHARGED) : 10;

export default {
  session_reservation_time,
  minimal_duration_charged,
} as const;
