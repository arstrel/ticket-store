import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@sbsoftworks/gittix-common';
import { createOrderRouter } from './routes/create';
import { showOrderRouter } from './routes/show';
import { cancelOrderRouter } from './routes/delete';

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
app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(cancelOrderRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
