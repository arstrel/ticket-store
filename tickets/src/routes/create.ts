import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.post(
  '/api/tickets',
  [
    body('title').notEmpty().withMessage('You must provide a title'),
    body('price').notEmpty().withMessage('You must provide a price'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    res.status(200).send('ticket created');
  }
);

export { router as createTicketRouter };
