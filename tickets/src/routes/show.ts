import express, { Request, Response } from 'express';
import { Ticket, TicketAttrs } from '../models/ticket';
import { NotFoundError } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById<TicketAttrs>(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket);
});

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.status(200).json(tickets);
});

export { router as showTicketRouter };
