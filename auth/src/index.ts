import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// express will see that the traffic is being proxied by kubernetes and won't trust https connection
// this setting is to fix that
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JTW_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('[Auth service] Connected to mongoDB');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('[Auth service] Listening at port 3000');
  });
};

start();
