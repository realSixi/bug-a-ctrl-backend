import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import usersService from "@services/users.service";

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies["Authorization"] || (req.header("Authorization") ? req.header("Authorization").split("Bearer ")[1] : null);
    const ApiKey = req.header("Api-Key") || req.query["apikey"];

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await usersService.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else if (ApiKey && ApiKey instanceof String) {
      const findUser = await usersService.findByApikey(ApiKey.trim());
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Invalid Api-Key"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export default authMiddleware;
