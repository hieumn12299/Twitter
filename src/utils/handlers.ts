import { NextFunction, Request, Response } from 'express';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;

export const wrapRequestHandler = (fn: Func) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
