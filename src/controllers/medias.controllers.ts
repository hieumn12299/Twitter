import { Request, Response } from 'express';
import { handleUploadSingleImage } from '~/utils/file';

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await handleUploadSingleImage(req);
  return res.json(data);
};
