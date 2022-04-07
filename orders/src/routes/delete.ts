import express, { Request, Response } from 'express';
import { Order, OrderAttr } from '../models/order';
import { NotFoundError, requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findOneAndDelete<OrderAttr>({
      _id: req.params.orderId,
      owner: req.currentUser!.id,
    });

    if (!order) {
      throw new NotFoundError();
    }

    res.status(200).json(order);
  }
);

export { router as deleteOrderRouter };
