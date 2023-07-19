import { Router } from 'express';
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers';
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handlers';

const mediaRouter = Router();

/**
 * Description: Upload image
 * Path: /upload-image
 * Method: POST
 * Body: { image: File }
 */

mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
);

/**
 * Description: Upload video
 * Path: /upload-video
 * Method: POST
 * Body: { video: File }
 */

mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
);

export default mediaRouter;
