import { NextFunction, Request, Response } from "express";

import authService from "@services/auth.service";
import randomUtils from "@utils/random.utils";
import { TWITCH_CLIENT_ID, TWITCH_REDIRECT_URI } from "@config";
import twitchService from "@services/twitch.service";
import usersService from "@services/users.service";

class AuthController {
  public twitchAuthRequestCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const csrfState = randomUtils.generateRandomHex(20);
      res.cookie("csrfState", csrfState, { maxAge: 1000 * 60 * 5 });


      const query = {
        scope: "",
        client_id: TWITCH_CLIENT_ID,
        state: csrfState,
        response_type: "code",
        redirect_uri: TWITCH_REDIRECT_URI
      };

      res.redirect(`https://id.twitch.tv/oauth2/authorize?${new URLSearchParams(query).toString()}`);
    } catch (error) {
      next(error);
    }
  };

  public twitchAuthCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, state } = req.query;
      const { csrfState } = req.cookies;

      if (state != csrfState) {
        res.status(422).send("invalid state");
        return;
      }

      const { access_token } = await twitchService.getAccessToken(code as string);
      const twitchUser = await twitchService.getUserInfo(access_token);
      console.log("Got twitchUser", twitchUser);
      await usersService.findOrCreate(twitchUser.id, twitchUser.username);

      const { user, cookie } = await authService.login(twitchUser.id);

      res.setHeader("Set-Cookie", [cookie]);
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie("Authorization")
        .redirect("/");
    } catch (e) {
      next(e);
    }
  };


}

export default AuthController;
