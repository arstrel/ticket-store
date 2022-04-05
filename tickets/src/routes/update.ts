import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from '@sbsoftworks/gittix-common';
import { body } from 'express-validator';
import { requireAuth } from '@sbsoftworks/gittix-common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be more than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });

    res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
