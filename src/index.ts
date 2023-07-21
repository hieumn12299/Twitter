import express from 'express';
import databaseService from './services/database.services';
import userRouter from './routes/users.routes';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import mediaRouter from './routes/medias.routes';
import { initFolder } from './utils/file';
import { config } from 'dotenv';
import path from 'path';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir';
import staticRouter from './routes/static.routes';
config();

const app = express();

const port = process.env.PORT || 4100;

//Tao folder upload
initFolder();

databaseService.connect().catch(console.dir);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/users', userRouter);
app.use('/medias', mediaRouter);
app.use('/static', staticRouter);
// app.use('/static/video', express.static(path.resolve(UPLOAD_VIDEO_DIR)));
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
