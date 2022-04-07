import express, { Request, Response } from 'express';
import { Order, OrderAttr } from '../models/order';
import { NotFoundError, requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

// orders that belong to a current user
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find<OrderAttr>({ owner: req.currentUser!.id });

  res.status(200).json(orders);
});

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.find<OrderAttr>({
      _id: req.params.orderId,
      owner: req.currentUser!.id,
    });

    if (!order) {
      throw new NotFoundError();
    }

    res.status(200).json(order);
  }
);

export { router as showOrderRouter };
