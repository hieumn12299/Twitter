import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RegisterRequestBody } from '~/models/requests/User.requests';
import usersService from '~/services/users.services';

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'hieu.mn299@gmail.com' && password === '123456') {
    return res.status(200).json({
      message: 'Login success'
    });
  }
  return res.status(400).json({
    error: 'Login Failed'
  });
};

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body);
  return res.json({
    message: 'Register Success',
    result
  });
};
