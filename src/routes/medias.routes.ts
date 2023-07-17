import { Router } from 'express';
import { uploadSingleImageController } from '~/controllers/medias.controllers';
import { wrapRequestHandler } from '~/utils/handlers';

const mediaRouter = Router();

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */

mediaRouter.post('/upload-image', uploadSingleImageController);

export default mediaRouter;
