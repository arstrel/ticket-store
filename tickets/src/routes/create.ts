import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket, TicketAttrs } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { validateRequest, requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('You must provide a title'),
    body('price')
      .not()
      .isEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.create<TicketAttrs>({
      title: req.body.title,
      price: req.body.price,
      userId: req.currentUser!.id,
    });

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).json(ticket);
  }
);

export { router as createTicketRouter };
