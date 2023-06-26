import express from 'express';
import databaseService from './services/database.services';
import userRouter from './routes/users.routes';
import { defaultErrorHandler } from './middlewares/error.middlewares';

const app = express();

const port = 4100;

databaseService.connect().catch(console.dir);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/users', userRouter);
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
