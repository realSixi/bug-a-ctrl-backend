import * as crypto from 'crypto';

const generateRandomHex = (length = 40) => {
  return crypto.randomBytes(length / 2).toString('hex');
};

export default {
  generateRandomHex,
} as const;
