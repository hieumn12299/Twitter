import { Router } from 'express';
import { serveImageController, serveVideoController } from '~/controllers/medias.controllers';
import { wrapRequestHandler } from '~/utils/handlers';

const staticRouter = Router();

/**
 * Description: Serve image
 * Path: /image/:name
 */

staticRouter.get('/image/:name', wrapRequestHandler(serveImageController));

/**
 * Description: Serve video
 * Path: /video/:name
 */

staticRouter.get('/video/:name', wrapRequestHandler(serveVideoController));

export default staticRouter;
