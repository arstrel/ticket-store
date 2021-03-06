import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@sbsoftworks/gittix-common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError('Cannot cancel completed order');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    order.save();

    // publish an event saying this was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
