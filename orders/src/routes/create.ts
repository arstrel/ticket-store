import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order, OrderAttr, OrderStatus } from '../models/order';
import { Ticket, TicketAttr } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  BadRequestError,
} from '@sbsoftworks/gittix-common';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('You must provide a ticketId')],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure it is not reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = await Order.create<OrderAttr>({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    // Publish "order:created" event

    // await new TicketCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   title: order.title,
    //   price: order.price,
    //   userId: order.userId,
    // });

    res.status(201).json(order);
  }
);

export { router as createOrderRouter };
