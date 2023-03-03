import fetch from 'node-fetch';
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '@config';

interface UserInfoType {
  id: number;
  username: string;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface UserInfoResponse {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

const getUserInfo = async (token: string): Promise<UserInfoType> => {
  const response = await fetch(`https://id.twitch.tv/oauth2/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const jsonResponse = await response.json();

  console.log('got user:', jsonResponse);
  return {
    id: Number.parseInt(jsonResponse.sub),
    username: jsonResponse.preferred_username,
  };
};

const getUserById = async (user_id: number) => {
  const response = await fetch(`https://api.twitch.tv/helix/users?id=${user_id}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      Authorization: `Bearer ${(await getAppAccessToken()).access_token}`,
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse.data[0] as UserInfoResponse;
};

const getAppAccessToken = async () => {
  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse as AccessTokenResponse;
};

const getAccessToken = async (code: string) => {
  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/callback',
      code,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse as AccessTokenResponse;
};

export default {
  getUserById,
  getUserInfo,
  getAccessToken,
} as const;
