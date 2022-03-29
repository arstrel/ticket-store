import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  BadRequestError,
  NotAuthorizedError,
  validateRequest,
  currentUser,
} from '@sbsoftworks/gittix-common';

const router = express.Router();

router.post(
  '/api/tickets',
  [
    body('title').notEmpty().withMessage('You must provide a title'),
    body('price').notEmpty().withMessage('You must provide a price'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }
    res.status(200).send('ticket created');
  }
);

router.get('/api/tickets', async (req: Request, res: Response) => {
  res.status(200).send({ title: 'test', price: 10 });
});

export { router as createTicketRouter };
