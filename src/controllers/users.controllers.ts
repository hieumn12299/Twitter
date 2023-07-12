import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enums';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordBody,
  GetProfileReqParams,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterRequestBody,
  ResetPasswordBody,
  TokenPayload,
  UnfollowReqParams,
  UpdateMeReqBody
} from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';
import usersService from '~/services/users.services';

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const user_id = (user._id as ObjectId).toString();
  const result = await usersService.login({ user_id, verify: user.verify });
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
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload;
  const { refresh_token } = req.body;
  const result = await usersService.refreshToken({ user_id, old_refresh_token: refresh_token, verify });
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  });
};

export const verifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND });
  //NOTE: Nếu đã verify thì không báo lỗi, trả về status OK với message là đã verify rồi
  if (!user.email_verify_token) return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE });
  const result = await usersService.verifyEmail(user_id);
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  });
};

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND });
  if (user.verify === UserVerifyStatus.Verified)
    return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE });
  const result = await usersService.resendVerifyEmail(user_id);
  return res.json({ result });
};

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User;
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify });
  return res.json({ result });
};

export const verifyForgotPasswordTokenController = async (_req: Request, res: Response) => {
  return res.json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS });
};

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_verify_token as TokenPayload;
  const { password } = req.body;
  const result = await usersService.resetPassword(user_id, password);
  return res.json({ result });
};

export const meController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await usersService.getMe(user_id);
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  });
};

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { body } = req;
  const user = await usersService.updateMe(user_id, body);
  res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  });
};

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  const { username } = req.params;
  const user = await usersService.getProfile(username);
  res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  });
};

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { followed_user_id } = req.body;
  const result = await usersService.follow(user_id, followed_user_id);
  res.json({ result });
};

export const unfollowController = async (req: Request<UnfollowReqParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { user_id: followed_user_id } = req.params;
  const result = await usersService.unfollow(user_id, followed_user_id);
  res.json({ result });
};

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { password } = req.body;
  const result = await usersService.changePassword(user_id, password);
  res.json({ result });
};
