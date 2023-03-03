import User from '@models/users.model';
import randomUtils from '@utils/random.utils';
import twitchService from '@services/twitch.service';

async function findAllUser(): Promise<User[]> {
  return User.findAll();
}

async function findByApikey(apikey: string) {
  return User.findOne({
    where: {
      apikey: apikey,
    },
  });
}

async function findOrCreate(id: number, username?: string) {
  if (!username) {
    const userInfo = await twitchService.getUserById(id);
    username = userInfo.display_name;
  }
  const [user, created] = await User.findOrCreate({
    where: { id: id },
    defaults: {
      username: username,
      apikey: randomUtils.generateRandomHex(),
    },
  });
  return user;
}

async function findById(id: number) {
  return User.findByPk(id);
}

export default {
  findAllUser,
  findOrCreate,
  findByApikey,
  findById,
} as const;
