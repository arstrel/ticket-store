import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@sbsoftworks/gittix-common';

const router = express.Router();

// orders that belong to a current user
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );

  res.status(200).json(orders);
});

router.get(
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

    res.status(200).json(order);
  }
);

export { router as showOrderRouter };
