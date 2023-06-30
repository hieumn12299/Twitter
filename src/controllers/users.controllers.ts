import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { USERS_MESSAGES } from '~/constants/messages';
import { LogoutReqBody, RefreshTokenReqBody, RegisterRequestBody, TokenPayload } from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import usersService from '~/services/users.services';

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const user_id = (user._id as ObjectId).toString();
  const result = await usersService.login(user_id);
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  });
};

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body);
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  });
};

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body;
  const result = await usersService.logout(refresh_token);
  return res.json(result);
};

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_refresh_token as TokenPayload;
  const { refresh_token } = req.body;
  const result = await usersService.refreshToken({ user_id, old_refresh_token: refresh_token });
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  });
};
