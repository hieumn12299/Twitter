import { Router } from 'express';
import { serveImageController, serveStreamVideoController } from '~/controllers/medias.controllers';
import { wrapRequestHandler } from '~/utils/handlers';

const staticRouter = Router();

/**
 * Description: Serve image
 * Path: /image/:name
 */

staticRouter.get('/image/:name', wrapRequestHandler(serveImageController));

/**
 * Description: Serve video
 * Path: /video-stream/:name
 */

staticRouter.get('/video-stream/:name', wrapRequestHandler(serveStreamVideoController));

export default staticRouter;
