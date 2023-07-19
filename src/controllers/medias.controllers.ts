import { Request, Response } from 'express';
import path from 'path';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir';
import { USERS_MESSAGES } from '~/constants/messages';
import mediasService from '~/services/medias.services';

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadImage(req);
  return res.json({ result: url, message: USERS_MESSAGES.UPLOAD_SUCCESS });
};

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadVideo(req);
  return res.json({ result: url, message: USERS_MESSAGES.UPLOAD_SUCCESS });
};

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params;
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found');
    }
  });
};

export const serveVideoController = async (req: Request, res: Response) => {
  const { name } = req.params;
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err && (err as any).status) {
      return res.status((err as any).status).send('Not Found');
    }
  });
};
