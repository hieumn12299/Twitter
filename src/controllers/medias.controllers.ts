import { Request, Response } from 'express';
import path from 'path';
import { UPLOAD_DIR } from '~/constants/dir';
import { USERS_MESSAGES } from '~/constants/messages';
import mediasService from '~/services/medias.services';

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadSingleImage(req);
  return res.json({ result: url, message: USERS_MESSAGES.UPLOAD_SUCCESS });
};

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params;
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found');
    }
  });
};
