export interface BuyTimeMessage {
  created: string;
  type: 'BUY_TIME';
  user_id: string;
  duration: string;
}

export interface BugAControlMessage {
  created: string;
  user_id: number;
  username: string;
  joint_a: number;
  joint_b: number;
  joint_c: number;
  vertical_axis: number;
}
