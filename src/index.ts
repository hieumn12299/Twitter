import express from 'express';
import databaseService from './services/database.services';

const app = express();

const port = 4100;

databaseService.connect().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
