import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sbsoftworks/gittix-common';

const app = express();
// express will see that the traffic is being proxied by kubernetes and won't trust https connection
// this setting is to fix that
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.get('/tickets', (req, res) => {
  res.json('ticket service');
});

app.get('/tickets/1', (req, res) => {
  res.json('ticket service: ticket 1');
});

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };